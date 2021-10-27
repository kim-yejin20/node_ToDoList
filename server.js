// 서버를 express를 사용해서 만들기 위한 문법임.
const express = require('express');  // 설치한 라이브러리 첨부
const app = express();               // 첨부한 라이브러리로 새로운 객체 생성

const bodyParser = require('body-parser');  // html에서 받은 요청 데이터 해석을 쉽게 도와줌. 
                                            // POST 요청으로 서버에 데이터 전송하고 싶다면 1. body-parser 필요 2.form 데이터의 경우 input에 name설정
app.use(bodyParser.urlencoded({extended : true}));


app.listen(8080, function() {
    console.log('listening on 8080')
});  // .listen()은 로컬로 서버를 열 수 있음.



// get 요청시 응답
app.get('/pet', function(요청, 응답){
    응답.send('펫용품 쇼핑 사이트 입니다! 반갑습니다!')
});

// arrow function 사용시 
app.get('/pet', (요청, 응답) => {
    응답.send('펫용품 쇼핑 사이트 입니다! 반갑습니다!')
});




app.get('/beauty', function(req,res){
    res.send('뷰티 용품 쇼핑 페이지 입니다. 정현아 나 배고파!')
});

app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html')
});


app.get('/write', function(req,res){
    res.sendFile(__dirname + '/write.html')
});



// POST 요청 / '경로' : 어떤 경로로 post 요청을 보낼 것인가. 
// write.html에서 form action에 써준 '/add를' 써줌 

// app.post('경로', function(요청, 응답){
//     응답.send('전송완료')
// });

// write.html input창에서 받은 정보들은 function의 요청안에 담김. 

app.post('/add', function(요청, 응답){
    응답.send('전송완료')
    console.log(요청.body);
    console.log(요청.body.title);
});