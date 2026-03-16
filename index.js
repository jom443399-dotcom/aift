const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Neon DB 연결 설정
// SSL 설정이 되어 있어야 Neon(Serverless)에 접속 가능합니다.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/', async (req, res) => {
  try {
    // test 테이블에서 첫 번째 행의 name 가져오기
    const result = await pool.query('SELECT name FROM test LIMIT 1');
    
    if (result.rows.length > 0) {
      const name = result.rows[0].name;
      res.send(`<h1>hello ${name}</h1>`);
    } else {
      res.send('<h1>데이터가 없습니다.</h1>');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('DB 연결 에러가 발생했습니다.');
  }
});

app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
