# 실시간 웹 서비스 만들기

## 01. 인스타그램 실시간 알림

<font size=2>첫 번째로 만들어볼 예제는 인스타그램의 알림 기능이다.</font><br />
<font size=2>인스타그램에서는 좋아요를 받았을 때 앱 상단 하트에 빨간색으로 표시된다.</font><br />
<font size=2>인스타그램과 동일하게 좋아요를 받은 사용자가 바로 알 수 있도록 상다네 빨간색으로 노출되도록 구현하겠다.</font><br />

### 프로젝트 초기 설정

<font size=2>먼저 instagram-notification이라는 프로젝트 폴더를 생성한다.</font><br />
<font size=2>그 아래에 server와 client 폴더를 만든다. client 폴더에서 CRA를 이용하겠다.</font><br />

```
> cd instagram-notification
> mkdir server
> npx create-react-app client
```

<font size=2>다음으로 server 폴더로 이동해서 server.js 파일을 생성하고 npm 프로젝트를 설정하겠다.</font><br />

```
> cd server
> npx init
```

<font size=2>또 인스타그램 프로젝트에서 사용할 images 폴더도 생성한다.</font><br />

```
> cd..
> cd client/src/
> mkdir images
```

```
이미 파일 확인하기

프로젝트에 사용하는 파일은 깃허브 주소를 참고하면 된다.
https://github.com/devh-e/socket-programming-using-react/tree/master/part2/instagram-notification/client/src/images
```

<font size=2>깃허브에서 다운로드한 이미지 파일을 images 폴더에 넣는다.</font><br /><br />

<font size=2>마지막으로 client 폴더에 사용하지 않는 파일은 삭제하겠다.</font><br />

```
 - App.css
 - App.test.js
 - index.css
 - logo.svg
 - reportWebVitals.js
 - setupTests.js
```

<font size=2>App.js에서 방금 지웠던 import 항목들과 로고를 사용하는 부분을 삭제한다.</font><br />

```
const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
```

<font size=2>추가적으로 index.js에서 참조하지 않는 파일과 React.strictMode를 제거하겠다.</font><br />

```
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

### 서버 사이드

```
필요한 라이브러리

 • nodemon : nodejs 서버를 모니터링하고 쉽게 재시작하기 위해 사용한다.
 • socket.io : 소켓 통신을 위해 사용한다.
```

서버 사이드에 필요한 라이브러리를 설치하기 위해 npm을 이용한다.

```
> npm install socket.io
> npm install nodemon
```

<font size=2>또한 서버를 쉽게 시작하기 위해 package.json 파일의 scripts 부분에 다음 명령어를 추가한다.</font><br />

```
"start": "nodemon server.js",
```

<font size=2>인스타그램 예제에서는 포스팅을 위한 목(mock) 데이터가 필요하다.</font><br />
<font size=2>data.js 파일을 생성하고 안에 목 데이터를 만든다.</font><br />

```
data.js

// 1
module.exports.posts = [
  {
    id: 1,
    // 2
    userName: "",
    location: "Republic of Korea",
    userImg:
      "https://cdn.pixabay.com/photo/2017/02/16/23/10/smile-2072907_1280.jpg",
    postImg:
      "https://cdn.pixabay.com/photo/2023/02/04/09/20/castle-7766794_1280.jpg",
  },
  {
    id: 2,
    userName: "",
    location: "USA",
    userImg:
      "https://cdn.pixabay.com/photo/2018/02/21/08/40/woman-3169726_1280.jpg",
    postImg:
      "https://cdn.pixabay.com/photo/2023/01/21/13/39/night-sky-7733876_1280.jpg",
  },
  {
    id: 3,
    userName: "",
    location: "Japan",
    userImg:
      "https://cdn.pixabay.com/photo/2017/12/31/15/56/portrait-3052641_1280.jpg",
    postImg:
      "https://cdn.pixabay.com/photo/2022/09/07/17/26/vintage-pocket-watch-7439233_1280.jpg",
  },
  {
    id: 4,
    userName: "",
    location: "Italy",
    userImg:
      "https://cdn.pixabay.com/photo/2016/11/20/18/18/girl-1843477_1280.jpg",
    postImg:
      "https://cdn.pixabay.com/photo/2022/03/11/10/55/couple-7061929_1280.jpg",
  },
  {
    id: 5,
    userName: "",
    location: "Canada",
    userImg:
      "https://cdn.pixabay.com/photo/2017/04/01/21/06/portrait-2194457_1280.jpg",
    postImg:
      "https://cdn.pixabay.com/photo/2022/11/16/16/56/city-7596379_1280.jpg",
  },
];
```

<font size=2>이 데이터들은 사용자가 로그인했을 때 임의로 다섯 개 중 하나를 할당해서 포스팅한 것처럼 노출한다.</font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />