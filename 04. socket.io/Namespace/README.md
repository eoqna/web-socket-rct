### 네임 스페이스 (133p)

<font size=2>네임스페이스(namespace)는 서비스를 내부적으로 구분할 수 있는 공간을 의미한다.</font><br />
<font size=2>예를 들어 옷 판매 사이트가 있다고 가정하겠다. 옷 판매 사이트는 여러 개의 도메인이 있다.</font><br />
<font size=2>주문, 상품, 배송 등 관리 포인트가 있고 이런 관리 포인트를 네임스페이스로 구분지어 관리할 수 있다.</font><br /><br />

<font size=2>앞에서는 룸이라는 개념을 이용해서 단체방을 생성했다.</font><br />
<font size=2>여기서는 단체방이라고 말했지만 사실은 룸을 이용해서 관리 포인트를 구분한 것과 같다.</font><br />
<font size=2>그렇다면 네임스페이스를 사용하지 않고 룸만으로도 충분히 사관리할 수 있지 않을까?</font><br /><br />

<font size=2>가능하긴 하다. 하지만 네임스페이스는 룸의 상위 버전으로 용도가 조금 다르다.</font><br />
<font size=2>만약 네임스페이스를 이용해 옷 판매 사이트의 상품이라는 공간을 만들었다면 룸을 이용해 신발, 하의, 상의와 같은 상세한 상품 카테고리를 만들 수도 있다.</font><br /><br />

<font size=2>라우터에 따른 네임스페이스에 접속 유무를 확인할 수 있는 단순한 예제를 만들어보겠다.</font><br />
<font size=2>Connect 버튼을 클릭했을 때 "Connected"라는 초록색 글자가 보이면 우리가 지정한 네임스페이스로 정상적으로 연결될 것이다.</font><br />

### 프로젝트 초기 설정 (134p)

<font size=2>namespace 폴더를 생성하고 그 아래에 client와 server 폴더를 만든다.</font><br />

```
> mkdir namespace
> cd namespace
> mkdir server
> npx create-react-app client
```

<font size=2>기존에 만들었던 프로젝트와 동일하게 CRA를 이용해서 client 폴더를 생성했다.</font><br />

### 클라이언트 사이드 (134p)

```
필요한 라이브러리
 • socket.io-client : socket.io를 실행하기 위한 라이브러리이다.
 • react-router-dom : 이번 예제에 필요한 라우팅 라이브러리이다.
```

<font size=2>이제 클라이언트 사이드부터 구현을 시작하겠다. 먼저 필요한 라이브러리부터 설치한다.</font><br />

```
> npm i socket.io-client
> npm i react-router-dom
```

<font size=2>이제 앞에서 진행했던 프로젝트와 동일하게 client 폴더에 사용하지 않는 파일과 폴더를 삭제하겠다.</font><br />

```
 - App.test.js
 - logo.svg
 - reportWebVitals.js
 - setupTests.js
```

<font size=2>index.js의 사용하지 않는 부분은 제거하겠다.</font><br />

```
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

<font size=2>App.js에서 logo 파일을 사용하는 부분도 삭제한다.</font><br />

```
import './App.css';

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

### App.js (137p)

<font size=2>이제 App.js와 라우팅에 필요한 Page를 하나씩 만들겠다.</font><br />

```
// 1
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import GoodsPage from "./GoodsPage";
import UserPage from "./UserPage";
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to="/goods" />} />
        <Route path="/goods" element={<GoodsPage />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </Router>
  );
}

export default App;
```

<font size=2>1. 라우팅을 위한 함수를 불러왔다. 또한 각각 라우팅에 구분되는 Page 컴포넌트들도 추가했다.</font><br /><br />
<font size=2>2. 우리가 설정한 routing은 /goods와 /user 두 가지 이다.</font><br />
<font size=2>만약 루트("/") 경로로 접근한다면 자동으로 /goods로 리다이렉트되도록 설정했다.</font><br /><br />

### App.css (138p)

<font size=2>App.css 내용은 간단하다. 활성/비활성화 처리에 필요한 색상을 스타일링했다.</font><br />

```
.text-wrap {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.active {
  color: green;
}
.deactive {
  color: red;
}
.btn-box {
  display: flex;
  flex-direction: row;
  gap: 5px;
}
.active-btn {
  border: 0;
  padding: 10px;
  border-radius: 5px;
  background-color: #00d8ff;
  cursor: pointer;
}
.deactive-btn {
  border: 0;
  padding: 10px;
  border-radius: 5px;
  background-color: red;
  color: #fff;
  cursor: pointer;
}
```

### socket.js (139p)

```
import { io } from "socket.io-client";

// 1
export const socketGoods = io("http://localhost:5000/goods", {
  autoConnect: false,
});

// 2
export const socketUser = io("http://localhost:5000/user", {
  autoConnect: false,
});
```

<font size=2>1~2. 지금까지와는 다른 방식으로 socket.io 객체를 초기화했다.</font><br />
<font size=2>앞으로 Part 2에서 사용할 예제는 위와 같은 방식으로 진행될 예정이다.</font><br />
<font size=2>이렇게 객체를 하나의 파일에서 따로 관리할 경우 개발 환경에 따른 분기 처리가 쉽고 가독성 또한 좋아진다.</font><br /><br />

<font size=2>두 개의 객체가 준비되어 있다.</font><br />
<font size=2>socketGoods는 goods 네임스페이스로 접속된 소켓 객체이고 아래에 있는 socketUser는 user 네임스페이스에 접속된 소켓 객체이다.</font><br />
<font size=2>마지막으로 autoConnect: false라는 속성이 보인다.</font><br />
<font size=2>이 속성을 적용할 경우 리액트 컴포넌트가 마운트될 때 자동으로 소켓이 연결되는 것이 아니라 수동으로 socket.connect()라는 함수를 이용해서 연결해야 한다.</font><br />

```
io([url][, options])

socket.io에서는 소켓을 연결할 때 다양한 옵션이 있다.
예를 들어 'reconnection', 'autoConnect', 'timeout' 등 연결에 필요한 항목을 선택할 수 있다.

 • 참고 : https://socket.io/docs/v4/client-api/
```

### UserPage.js와 GoodsPage.js (140p)

<font size=2>UserPage.js와 GoodsPage.js의 코드가 비슷하기 때문에 한 번에 설명하겠다.</font><br />

<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />