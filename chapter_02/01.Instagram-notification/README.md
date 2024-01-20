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

<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />