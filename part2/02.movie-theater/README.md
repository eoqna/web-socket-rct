## 극장 좌석 예약 서비스 (185p)

<font size=2>좌석 예약 서비스는 우리의 일상에서 흔히 접할 수 있는 시스템이다.</font><br />
<font size=2>극장, 기차, 식당 등 많은 종류가 있지만 극장의 좌석 예약 서비스를 만들면서 웹 소켓을 이해하겠다.</font><br />
<font size=2>3개의 영화 중 하나를 선택해서 클릭할 수 있고, 하나의 영화를 선택하면 좌석을 선택할 수 있는 UI를 보여준다.</font><br />
<font size=2>좌석마다 이름이 붙어있고 파란색으로 선택한 영역이 표시된다.</font><br />
<font size=2>최종적으로 Confirm 버튼을 클릭하면 선택한 부분이 빨간색으로 표시된다.</font><br />
<font size=2>물론 동시에 접속한 고객들의 선택 좌석 또한 빨간색으로 동일하게 표시된다.</font><br />

### 프로젝트 초기 설정 (186p)

<font size=2>먼저 movie-theater라는 프로젝트 폴더를 생성한다.</font><br />
<font size=2>그 아래에 server와 client 폴더를 만든다. client는 CRA를 이용해 만든다.</font><br />

```
> mkdir server
> npx create-react-app client
```

<font size=2>server 폴더로 이동해서 npm 프로젝트를 설정하고 server.js 파일을 생성한다.</font><br />

```
> cd server
> npm init
```

<font size=2>좌석 예약 프로젝트에서 사용할 images 폴더도 생성한다.</font><br />

```
> cd client/src
> mkdir images
```

```
이미지 파일 확인하기

프로젝트에 사용하느 파일은 깃허브 주소를 참고하면 된다.
https://github.com/devh-e/socket-programming-using-react/tree/master/part2/movie-theater/client/src/images
```

<font size=2>깃허브에서 다운로드한 이미지 파일을 images 폴더에 넣어준다.</font><br />
<font size=2>마지막으로 client 폴더에 사용하지 않는 파일을 삭제해준다.</font><br />

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

<font size=2>추가적으로 index.js에서 참조하지 않는 파일과 React.strictMode를 제거해준다.</font><br />

```
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

### 서버 사이드 (189p)

```
필요한 라이브러리

 • nodemon : nodejs 서버를 모니터링하고 쉽게 재시자하기 위해 사용한다.
 • socket.io : 소켓 통신을 위해 사용한다.
```

<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />