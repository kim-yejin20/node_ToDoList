// 서버를 express를 사용해서 만들기 위한 문법임.
const express = require('express'); // 설치한 라이브러리 첨부
const app = express(); // 첨부한 라이브러리로 새로운 객체 생성

const bodyParser = require('body-parser'); // html에서 받은 요청 데이터 해석을 쉽게 도와줌.
// POST 요청으로 서버에 데이터 전송하고 싶다면 1. body-parser 필요 2.form 데이터의 경우 input에 name설정
app.use(bodyParser.urlencoded({ extended: true }));

const MongoClient = require('mongodb').MongoClient;

// 환경변수로 중요한 정보 관리하기
require('dotenv').config();

//ejs 라이브러리를 사용하겠다는 뜻
app.set('view engine', 'ejs');

//css사용 -> 미들웨어 : 요청이랑 응답 사이에 동작하는 자스 코드
app.use('/public', express.static('public'));

//method-override 사용
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

//session 방식 로그인 기능 구현하기
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

//미들웨어 설정
app.use(
  session({ secret: '비밀코드', resave: true, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

var db;
MongoClient.connect(process.env.DB_URL, function (에러, client) {
  // 연결되면 할일

  // 에러시
  if (에러) return console.log(에러);

  db = client.db('todoapp');

  // db.collection('post').insertOne( {이름 : 'John', 나이 : 20}, function(에러,결과){
  //     console.log('저장완료');
  // });

  app.listen([process.env.PORT], function () {
    console.log('listening on server');
  });
});

// app.listen(8080, function() {
//     console.log('listening on 8080')
// });  // .listen()은 로컬로 서버를 열 수 있음. mogoclien.connect 함수로 이동

// get 요청시 응답
app.get('/pet', function (요청, 응답) {
  응답.send('펫용품 쇼핑 사이트 입니다! 반갑습니다!');
});

// arrow function 사용시
app.get('/pet', (요청, 응답) => {
  응답.send('펫용품 쇼핑 사이트 입니다! 반갑습니다!');
});
app.get('/beauty', function (req, res) {
  res.send('뷰티 용품 쇼핑 페이지 입니다.');
});

app.get('/', function (req, res) {
  // res.sendFile(__dirname + '/index.html');
  res.render('index.ejs');
});

// app.get('/write', function (req, res) {
//   res.sendFile(__dirname + '/write.ejs');
// });

// POST 요청 / '경로' : 어떤 경로로 post 요청을 보낼 것인지 설정
// write.html에서 form action에 써준 '/add를' 써줌

// app.post('경로', function(요청, 응답){
//     응답.send('전송완료')
// });

// write.html input창에서 받은 정보들은 function의 요청안에 담김.

// app.post('/add', function(요청, 응답){
//     응답.send('전송완료')
//     console.log(요청.body);
//     console.log(요청.body.title);
// });

// 글 작성
app.post('/add', function (요청, 응답) {
  응답.send('전송완료');

  const date = 요청.body.date;
  const title = 요청.body.title;

  db.collection('counter').findOne(
    { name: '게시물갯수' },
    function (에러, 결과) {
      console.log(결과.totalPost);
      var total = 결과.totalPost;

      db.collection('post').insertOne(
        { _id: total + 1, 날짜: date, 제목: title },
        function (에러, 결과) {
          console.log('저장완료');

          //counter라는 콜렉션에 있는 totalPost 라는 항목도 1 증가시켜야함
          db.collection('counter').updateOne(
            { name: '게시물갯수' },
            { $inc: { totalPost: 1 } },
            function (에러, 결과) {
              if (에러) {
                return console.log(에러);
              }
            }
          );

          // 콜백함수 안쓸시
          // db.collection('counter').updateOne({name : '게시물갯수'}, { $inc : {totalPost : 1} })
        }
      );
    }
  );
});

// write page
app.get('/write', function (요청, 응답) {
  // db에 저장된 post라는 collection안의 모든 데이터 꺼내기
  응답.render('write.ejs');
});

// 글 읽기
app.get('/list', function (요청, 응답) {
  // db에 저장된 post라는 collection안의 모든 데이터 꺼내기
  db.collection('post')
    .find()
    .toArray(function (에러, 결과) {
      console.log(결과);

      응답.render('list.ejs', { posts: 결과 });
    });
});

// 글 삭제
app.delete('/delete', function (요청, 응답) {
  console.log('여기');
  console.log(요청.body);

  요청.body._id = parseInt(요청.body._id);
  db.collection('post').deleteOne(요청.body, function (에러, 결과) {
    console.log('삭제완료');
    응답.status(200).send({ message: '성공했습니다' });
  });
});

// 내가 만든 글 수정 페이지ㅜ.ㅜ
// app.get('/edit', function (요청, 응답) {
//   console.log('서버요청');

//   db.collection('post').findOne(
//     { _id: parseInt(요청.params.id) },
//     function (에러, 결과) {
//       // 없는 id 번호일 경우 에러 처리 해주기
//       console.log(결과);
//       응답.render('edit.ejs', { data: 결과 });
//     }
//   );
// });

// 내가 만든 글 수정
// app.put('/editreq/:id', function (요청, 응답) {
//   응답.send('전송완료');

//   const date = 요청.body.date;
//   const title = 요청.body.title;

//   // 글 id 찾아서 -> 수정

//   db.collection('post').updateOne(
//     { _id: parseInt(요청.params.id) }, //filter?
//     { date: date, title: title }
//     // function (에러, 결과) {
//     //   // 없는 id 번호일 경우 에러 처리 해주기
//     //   console.log(결과);
//     //   응답.render('detail.ejs', { data: 결과 });
//     // }
//   );
// });

// 글 수정
app.get('/edit/:id', function (요청, 응답) {
  db.collection('post').findOne(
    { _id: parseInt(요청.params.id) },
    function (에러, 결과) {
      console.log(결과);
      응답.render('edit.ejs', { data: 결과 });
    }
  );
});

// form에 담긴 제목, 날짜 데이터로 DB 업데이트
app.put('/edit', function (요청, 응답) {
  db.collection('post').updateOne(
    //filter
    { _id: parseInt(요청.body.id) },

    // 변경할 내용 : form에서 보낸 데이터중 각각의 'name'
    { $set: { 제목: 요청.body.title, 날짜: 요청.body.date } },
    function (에러, 결과) {
      console.log('수정완료');
      응답.redirect('/list');
    }
  );
});

// 상세페이지
app.get('/detail/:id', function (요청, 응답) {
  db.collection('post').findOne(
    { _id: parseInt(요청.params.id) },
    function (에러, 결과) {
      // 없는 id 번호일 경우 에러 처리 해주기
      console.log(결과);
      응답.render('detail.ejs', { data: 결과 });
    }
  );
});

// 로그인
app.post('/login', function (요청, 응답) {});
