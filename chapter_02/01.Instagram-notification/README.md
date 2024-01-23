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

### 서버 사이드 (153p)

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

<font size=2>이 데이터들은 사용자가 로그인했을 때 임의로 다섯 개 중 하나를 할당해서 포스팅한 것처럼 노출한다.</font><br /><br />

<font size=2>1. module.exports라는 문법을 이용해 nodejs 환경에서 모듈화 작업을 할 수 있다.</font><br />
<font size=2>이렇게 모듈화된 js 파일은 require 문법을 이용해 어디서든 쉽게 사용할 수 있다.</font><br /><br />

<font size=2>2. userName 항목은 공백이다.</font><br />
<font size=2>나중에 클라이언트 사이드에서 전송된 사용자 이름이 들어가야 하기 때문에 초기에는 공백으로 설정한다.</font><br /><br />

### server.js (156p)

```
// 1
const { Server } = require("socket.io");
const { posts } = require("./data");

// 2
const io = new Server("5000", {
  cors: {
    origin: "http://localhost:3000",
  },
});

// 3
let users = [];

const addNewUser = (userName, socketId) => {
  !users.some((user) => user.userName === userName) &&
    users.unshift({
      ...posts[Math.floor(Math.random() * 5)],
      userName,
      socketId,
    });
};

// 5
const getUser = (userName) => {
  return users.find((user) => user.userName === userName);
};

// 6
io.use((socket, next) => {
  const userName = socket.handshake.auth.userName;
  if( !userName ) {
    console.log("err");
    return next(new Error("invalid userName"));
  }
  socket.userName = userName;
  next();
});

io.on("connection", (socket) => {
  // 7
  addNewUser(socket.userName, socket.id);
  socket.on("userList", () => {
    io.sockets.emit("user-list", users);
  });

  // 8
  socket.on("sendNotification", ({ senderName, receiverName, type }) => {
    const receiver = getUser(receiverName);
    io.to(receiver.socketId).emit("getNotification", {
      senderName,
      type,
    });
  });

  socket.on("disconnect", () => {
    console.log("logout");
  });
});
```

<font size=2>1. socket.io에서 소켓 서버를 생성하기 위해 Server 객체를 가져온다.</font><br />
<font size=2>또한 앞에서 미리 만들었던 포스팅에 필요한 목 데이터를 가져왔다.</font><br /><br />

<font size=2>2. 소켓 서버 포트 번호를 5000번으로 설정한다.</font><br />
<font size=2>추가적으로 CORS 설정으로 localhost:3000 이 접속할 수 있도록 허용했다.</font><br /><br />

<font size=2>3. users라는 배열을 생성했다.</font><br />
<font size=2>인스타그램 예제에서는 데이터베이스를 따로 사용하지 않기 때문에 임시로 users라는 배열에 접속한 사용자의 정보를 저장한다.</font><br />
<font size=2>이렇게 임시로 사용하는 것은 인-메모리(in-memory) 방식이라고 한다.</font><br />
<font size=2>users 배열에 저장된 정보가 클라이언트 사이드로 전송되어 포스팅 데이터 역할을 한다.</font><br /><br />

<font size=2>4. 새로운 사용자가 접속하면 users 배열에 저장하는 함수이다.</font><br />
<font size=2>기존 사용자가 있다면 저장하지 않는다.</font><br />
<font size=2>math.random() 함수를 이용해서 미리 만들어 두었던 5개의 목 데이터 중 하나를 선택해서 사용자가 포스팅한 정보로 만든다.</font><br />
<font size=2>함께 저장될 정보로는 사용자 이름과 소켓 아이디가 있다.</font><br />
<font size=2>여기서 말하는 socketId는 소켓을 연결할 때 할당하는 고유의 아이디를 말한다.</font><br /><br />

<font size=2>5. users 배열에서 일치하는 사용자 이름을 검색해서 반환한다.</font><br /><br />

<font size=2>6. socket.io가 제공하는 미들웨어(middleware)를 설정한다.</font><br />
<font size=2>socket.io에서는 use()를 이용해서 미들웨어를 설정할 수 있다.</font><br />
<font size=2>위 설정으로 클라이언트 사이드에서 넘어온 사용자 이름을 확인한다.</font><br />
<font size=2>만약 사용자 이름이 없다면 오류 객체를 실행해서 클라이언트 사이드 오류 콜백을 실행한다.</font><br />
<font size=2>이름이 있다면 socket 속성에 이름을 추가한다.</font><br /><br />

```
미들웨어

여기서 말하는 미들웨어(middleware)란 기존 로직 이전에 실행되는 함수를 의미한다.
이런 미들웨어의 개념은 socket.io에 국한된 것이 아니다.
nodejs는 물론 다른 프로그래밍 언어에서도 사용된다.

흔히 미들웨어에서는 서비스의 메인 비즈니스 로직을 처리하기보단 서비스를 관리하기 위한 로직들이 실행된다.
예를 들어 로깅(logging), 인증/인가와 같은 로직이다.

socket.io에서 미들웨어를 실행하면 연결 시점에서 딱 한 번만 실행하게 된다.
```

<font size=2>7. 미들웨어를 통과한 소켓 연결이 처음으로 시작되는 함수이다.</font><br />
<font size=2>addNewUser()는 user 배열에 사용자를 추가하는 역할을 한다.</font><br />
<font size=2>'userList' 이벤트는 소켓에 접속한 모든 사용자에게 추가된 포스팅을 전송하는 기능이다.</font><br /><br />

<font size=2>8. 'sendNotification' 이벤트는 좋아요를 눌렀을 때 호출된다.</font><br />
<font size=2>이벤트와 함께 전송된 이름을 통해서 좋아요를 받는 사람에게 알림을 표시한다.</font><br />
<font size=2>io.to([socketId])로 알림을 받을 특정한 사람에게만 정보를 전송한다.</font><br /><br />

### 클라이언트 사이드 (159p)

```
필요한 라이브러리
 • socket.io-client : 브라우저에서 socket.io를 사용하기 위해 사용한다.
 • react-icons : 웹에서 svg 이미지를 쉽게 사용하기 위해 필요하다.
 • react-router-dom : 리액트 페이지를 라우팅하기 위해 사용한다.
```

<font size=2>이제 클라이언트 사이드로 넘어가겠다.</font><br />
<font size=2>프로젝트 초기 설정 루트 (root) 디렉터리에서 CRA로 만든 client 폴더로 이동한다.</font><br />
<font size=2>그리고 npm을 이용해서 필요한 라이브러리를 추가한다.</font><br />

```
> npm install socket.io-client
> npm install react-icons
> npm install react-router-dom
```

<font size=2>이제 기본적인 준비는 끝났다.</font><br />
<font size=2>먼저 웹 소켓을 연결하기 위한 준비를 하겠다.</font><br />
<font size=2>루트 경로에서 socket.js라는 파일을 추가한다.</font><br />

### socket.js (160p)

<font size=2>socket.js 파일은 웹 소켓을 연결하기 위한 socket.io 객체를 초기화한다.</font><br />
<font size=2>autoConnect: false로 설정해서 사용자 아이디를 로그인할 때에 연결되도록 했다.</font><br />

```
import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  autoConnect: false,
});
```

### App.js (160p)

<font size=2>라우팅 설정에 필요한 App.js 파일을 수정하겠다.</font><br />

```
import "./App.css";
// 1
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { IndexContainer, MainContainer } from "./containers";

const App = () => {
  return (
    // 2
    <Router>
      <Routes>
        <Route path="/" element={<IndexContainer />} />
        <Route path="/main" element={<MainContainer />} />
      </Routes>
    </Router>
  );
}

export default App;
```

<font size=2>1. react-router-dom에서 라우팅에 필요한 컴포넌트를 불러온다.</font><br /><br />

<font size=2>2. 라우팅을 설정하는 부분이다.</font><br />
<font size=2>아직 IndexContainer와 MainContainer를 작성하지 않아서 빨간 줄로 표시될 수 있다.</font><br />
<font size=2>이 부분은 뒤에서 작성하겠다.</font><br /><br />

### 전역 변수를 위한 Context API 설정 (161p)

<font size=2>지금까지 useState, useRef를 이용해서 함수 범위의 변수만 설정했다.</font><br />
<font size=2>하지만 이런 함수 범위의 변수 처리는 한계가 있다.</font><br />
<font size=2>다른 페이지에서는 같은 변수를 사용할 수 없기 때문이다.</font><br />
<font size=2>예를 들어 로그인 페이지에서 선언되고 사용된 변수는 로그인 페이지에서만 사용할 수 있고 다른 페이지에서는 사용할 수 없다.</font><br /><br />

<font size=2>이런 한계를 극복하기 위해 리액트에서는 전역에서 공통으로 사용할 수 있는 전역 변수 API를 제공한다.</font><br />
<font size=2>설정된 변수는 어떤 페이지에서도 사용할 수 있다.</font><br />
<font size=2>이렇게 전역으로 상태를 관리하는 API를 Context API라고 한다.</font><br />

```
전역 상태 관리는 Context API만 있나?

리액트에서 가장 많이 사용했던 전역 상태 관리 라이브러리를 Redux가 있다.
하지만 버전 16.3 이후부터 리액트가 제공하는 Context API가 등장했다.
Context API의 등장으로 '굳이 외부 라이브러리인 Redux를 사용해야 할까?' 하는 의문이 생겼다.
그래서 상황에 맞게 redux와 Context API를 사용하는 추세이다.

현재는 Context API, Redux를 제외한 더 개선된 기능을 제공하는 다양한 라이브러리가 등장했다.
그 예로 recoil, SWR 등이 있다.
```

### context 파일 생성 (162p)

<font size=2>이제 우리 인스타그램 예제에서도 전역 변수를 사용할 수 있도록 context 폴더를 추가하겠다.</font><br />
<font size=2>src 경로로 이동 후에 context 폴더를 생성하고 그 아래에 index.js와 action.js 파일을 만든다.</font><br />

#### action.js

<font size=2>action.js의 내용은 간단하다.</font><br />
<font size=2>이 파일에서는 Context API로 관리하기 위한 명령어를 작성한다.</font><br />
<font size=2>AUTH_INFO라는 키워드를 이용해서 사용자 이름을 저장할 예정이다.</font><br />

```
export const AUTH_INFO = "AUTH_INFO";
```

#### index.js

<font size=2>Context API를 다루기 위한 핵심 부분이다.</font><br />
<font size=2>앞에서 배운 리액트에서 다루지 않은 내용이 있기 때문에 천천히 설명하면서 진행하겠다.</font><br />

```
// 1
import { createContext, useReducer } from "react";
import { AUTH_INFO } from "./action";

// 2
const initialState = {
  userName: "",
};

// 3
const Context = createContext({});

// 4
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_INFO:
      return {
        ...state,
        userName: action.payload,
      };
    default:
      return state;
  }
};

// 5
const StoreProvider = ({ children }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Context.Provider value={value}>{children}</Context.Provider> 
};

export { Context, StoreProvider };
```

<font size=2>1. 리엑트에서 제공하는 createContext, useReducer라는 함수를 불러온다.</font><br />
<font size=2> • createContext : 리액트의 전역 변수를 설정하기 위한 context 객체를 생성하는 함수이다.</font><br />
<font size=2> • useReducer : 지금까지 useState를 이용해서 상태를 관리했다.</font><br />
<font size=2> 하지만 useReducer를 이용하면 더 복잡한 상태 관리를 할 수 있다.</font><br />
<font size=2> 무엇보다 상태 관리라는 로직과 기존의 비즈니스 로직을 분리할 수 있다는 장점이 있다.</font><br /><br />

<font size=2>2. useReducer가 관리할 초기 객체 변수를 설정한다.</font><br />
<font size=2>사용자 이름을 저장하기 위한 userName을 작성했다.</font><br /><br />

<font size=2>3. createContext를 이용해서 전역으로 관리된 context를 생성했다.</font><br /><br />

<font size=2>4. useReducer의 핵심 기능인 상태를 관리하는 부분이다.</font><br />
<font size=2>switch 문을 이용해서 들어온 상태의 키워드 값을 구분하고 실행한다.</font><br /><br />

```
switch (action.type) {
  case AUTH_INFO:
    return {
      ...state,
      userName: action.payload,
    }
  default:
    return state;
}

action 객체에는 payload와 type이 있다.
payload는 상태를 업데이트하는 최신 변수를 받는다.
또한 앞에서 미리 정의한 AUTH_INFO라는 키워드가 보인다.
현재는 하나지만 애플리케이션의 규모가 커지면 개수가 늘어난다.
```

<font size=2>5. storeProvider는 Context API를 사용하는 모든 컴포넌트에게 변화를 알리는 역할을 한다.</font><br />
<font size=2>현재는 하나만 작성했지만 상황에 따라 여러 개의 store를 생성할 수 있다.</font><br /><br />

### App.js (165p)

<font size=2>마지막으로, 작성한 Context API를 최상위 컴포넌트인 App.js에 적용한다.</font><br />

```
import "./App.css";
// 1
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { IndexContainer, MainContainer } from "./containers";
import { StoreProvider } from "./context";

const App = () => {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route path="/" element={<IndexContainer />} />
          <Route path="/main" element={<MainContainer />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
}

export default App;
```

<font size=2>StoreProvider로 최상위 컴포넌트를 감싸면서 어디든지 전역 변수에 접근할 수 있도록 한다.</font><br />

### Card 컴포넌트 (165p)

<font size=2>인스타그램과 비슷하게 만들기 위해 상단의 헤더 부분과 포스팅을 위한 Card 컴포넌트를 제작하겠다.</font><br />
<font size=2>src 폴더 아래 components라는 폴더를 만들고 그 아래에 card와 navbar라는 폴더를 생성한다.</font><br />
<font size=2>card 폴더 아래에 Card.js와 Card.module.css 파일을 생성한다.</font><br />

```
Card.js

import { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import { BiMessageRounded } from "react-icons/bi";
import { FiMoreVertical } from "react-icons/fi";
// 1
import { socket } from "../../socket";
import styles from "./Card.module.css";

// 2
const Card = ({ key, post, loginUser }) => {
  // 3
  const [ liked, setLiked ] = useState(false);

  // 4
  const onLikeHandler = (e) => {
    const { type } = e.target.closest("svg").dataset;
    setLiked(type === "0");
    socket.emit("sendNotification", {
      senderName: loginUser,
      receiverName: post.userName,
      type,
    });
  };

  return (
    <div className={styles.card} key={key}>
      <div className={styles.info}>
        <div className={styles.userInfo}>
          <img src={post.userImg} alt="" className={styles.userImg} />
          <div className={styles.userName}>
            <div>{post.userName}</div>
            <div className={styles.loc}>{post.location}</div>
          </div>
        </div>
        <FiMoreVertical size={20} />
      </div>
      <img src={post.postImg} alt="" className={styles.postImg} />
      <div className={styles.icons}>
        // 5
        {liked ? (
          <AiFillHeart 
            className={styles.fillHeart}
            size={20}
            onClick={onLikeHandler}
            data-type="1"
          />
        ) : (
          <AiOutlineHeart
            className={styles.heart}
            size={20}
            onCanPlay={onLikeHandler}
            data-type="0"
          />
        )}
        <BiMessageRounded className={styles.msg} size={20} />
        <HiOutlinePaperAirplane className={styles.airplane} size={20} />
      </div>
    </div>
  );
};

export default Card;
```

<font size=2>1. 소켓 통신을 위해 socket 객체를 불러온다.</font><br /><br />

<font size=2>2. Card 컴포넌트에는 리스트를 구분하는 key 값과 포스팅 객체, 로그인 사용자 이름을 전달받는다.</font><br /><br />

<font size=2>3. useState를 이용해서 좋아요를 눌렀는지 누르지 않았는지 상태를 저장한다.</font><br />
<font size=2>좋아요를 눌렀다면 true, 누르지 않았다면 false이다.</font><br /><br />

<font size=2>4. onLikeHandler()는 좋아요를 클릭하면 호출된다.</font><br />
<font size=2>좋아요를 클릭했다면 'sendNotification'이라는 소켓 이벤트를 실행시킨다.</font><br />
<font size=2>그와 동시에 서버로 누른 사람과 좋아요를 받은 사람의 정보를 함께 전송한다.</font><br /><br />

<font size=2>5. liked라는 상태에 따라 꽉 찬 하트 혹은 빈 하트를 노출하게 했다.</font><br /><br />

<font size=2>다음은 Card 컴포넌트의 스타일 파일이다.</font><br />

```
.card {
  height: 280px;
  padding: 10px 0;
}
.info {
  display: flex;
  align-items: center;
  padding: 5px 20px;
  justify-content: space-between;
  font-weight: 500;
  font-size: 14px;
}
.userInfo {
  display: flex;
  flex-direction: row;
}
.userName {
  display: flex;
  flex-direction: column;
}
.loc {
  font-size: 12px;
}
.userImg {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}
.postImg {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.icons {
  display: flex;
  align-items: center;
  padding: 5px 20px;
  position: relative;
}
.heart {
  cursor: pointer;
}
.fillHeart {
  color: red;
  cursor: pointer;
}
.airplane {
  transform: rotate(45deg);
  margin-left: 6px;
  margin-bottom: 5px;
}
.msg {
  margin-left: 5px;
}
```

### Navbar 컴포넌트 (170p)

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