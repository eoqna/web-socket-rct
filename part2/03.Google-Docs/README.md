## 구글 문서 (213p)

<font size=2>구글 문서(Google Docs)는 구글에서 제공하는 온라인 문서 편집 도구이다.</font><br />
<font size=2>구글 문서를 이용해서 언제 어디서든지 간편하게 워드 파일을 작성하고 공유할 수 있다.</font><br />
<font size=2>구글 문서의 가장 큰 특징은 동시에 여러 사용자와 함께 문서를 제작/편집할 수 있다는 점이다.</font><br />
<font size=2>이번에 우리가 만들어볼 웹 서비스는 구글 문서의 클론 버전으로 동시에 문서를 편집할 수 있는 기능과 일정 시간이 지나면 자동으로 저장되는 기능을 만들어보겠다.</font><br />

### 프로젝트 초기 설정 (214p)

<font size=2>먼저 google-docs라는 프로젝트 폴더를 생성한다.</font><br />

```
> mkdir google-docs
```

<font size=2>그 아래에 server와 client 폴더를 만든다. client 폴더는 CRA를 이용한다.</font><br />

```
> cd google-docs
> mkdir server
> npx create-react-app client
```

<font size=2>server 폴더로 이동해서 npm 프로젝트를 설정하고 server.js 파일을 생성한다.</font><br />

```
> cd server
> npm init
```

<font size=2>client 폴더에서 사용하지 않는 파일은 삭제한다.</font><br />

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

<font size=2>추가적으로 index.js에서 참조하지 않는 파일과 React.strictMode를 제거한다.</font><br />

```
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

<font size=2>google-docs 프로젝트에는 사용자가 입력한 내용을 저장할 수 있는 공간이 필요하다.</font><br />
<font size=2>그 공간으로 mongoDB를 사용할 예정이다.</font><br />
<font size=2>이 책 부록에 있는 mongoDB에서 기본적인 connection url 설정을 확인하라.</font><br />

### 서버 사이드 (216p)

```
필요한 라이브러리

mongoose : mongoDB를 사용하기 위한 인터페이스 기능을 제공한다.
nodemon : nodejs 서버를 모니터링하고 쉽게 재시작하기 위해 사용한다.
socket.io : 소켓 통신을 위해 사용한다.
```

<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />