## 04. socket.io

<font size=2>socket.io는 기예므로 로치(Guillermo Rauch)가 만든 웹 서비스를 위한 라이브러리이다.</font><br />
<font size=2>socket.io는 세상에 나온 지 벌써 10년이 넘었다.</font><br />
<font size=2>초기에는 실시간 웹 서비스를 만드는 기술로 주목을 받았고 지금은 안정화 기간을 거치며 어느 누구나 쉽게 사용할 수 있는 라이브러리로 사랑받고 있다.</font><br />

### socket.io의 특징

<font size=2>그렇다면 사람들은 왜 socket.io를 선호하는 걸까?</font><br />
<font size=2>그 이유는 socket.io가 가지고 있는 특징 때문이다.</font><br />

```
1. socket.io는 클라이언트 심지어 하위 브라우저까지 지원한다.
  • 앞에서 살펴본 ws 모듈과는 다르게 socket.io는 브라우저인 클라이언트 레벨까지 지원한다.
  • socket.io는 하위 브라우저의 실시간 서비스를 지원할 수 있다.
    socket.io는 내부적으로 하위 브라우저로 판단하면 웹 소켓이 아닌 롱 폴링(Long polling) 방식으로 전환하여 실시간 통신을 한다.

2. socket.io는 다양한 언어로 구현할 수 있다.
  • socket.io는 다양한 서버 사이드 언어를 지원한다.
  • https://socket.io/docs/v4/

3. 자동 연결 기능(automatic reconnection)
  • socket.io는 클라이언트와 서버의 연결에 문제가 발생하면 자동으로 재연결을 시도한다.

4. socket.io는 API 추상화를 통해 복잡한 로직을 숨기고 간편하게 데이터를 전송할 수 있는 함수를 제공한다.

5. 손쉽게 채널 및 방 단위를 설계할 수 있다.
  • 흔히 실시간 서비스에는 private, broadcast, public과 같은 채널을 관리하게 된다.
    이런 관리를 손쉽게 할 수 있다.

6. socket.io는 웹 소켓의 구현체가 아니다.
  • socket.io는 실시간 통신을 하기 때문에 웹 소켓의 구현체라고 생각하는 사람들이 있다.
    그러나 다양한 API의 집합이기 때문에 웹 소켓도 socket.io를 구성하는 하나의 부품에 불과하다.
  • 클라이언트 혹은 서버, 둘 중 하나가 socket.io로 제작되었다면 한쪽도 socket.io로 제작되어야 한다.
```

<font size=2>정리하자면 socket.io는 실시간 서비스를 위한 다양한 API의 추상화 라이브러리이다.</font><br />
<font size=2>그래서 웹 소켓만으로는 불가능한 작업을 가능하게 하며 간편하게 실시간 웹 서비스를 구현할 수 있다.</font><br />

### socket.io의 주요 기능

<font size=2>위에서 socket.io의 특징들을 살펴봤다.</font><br />
<font size=2>이런 특징을 기반으로 socket.io는 넓은 입지를 다져왔다.</font><br />
<font size=2>이번에는 socket.io를 다룰 수 있는 주요 기능을 설명한다.</font><br />

### 소켓 이벤트

<font size=2>socket.io에서 주로 사용하는 이벤트 함수이다.</font><br />
<font size=2>socket.io를 이용해 예제를 만들다 보면 자연스럽게 사용하기 때문에 지금 먼저 살펴보겠다.</font><br />

```
 • connection : 클라이언트 연결 시 동작한다.
 • disconnection : 클라이언트 연결 해제 시 동작한다.
 • on() : 소켓 이벤트를 연결한다.
 • emit() : 소켓 이벤트가 생성된다.
 • socket.join() : 클라이언트에게 방을 할당한다.
 • sockets.in() / sockets.to() : 특정 방에 속해 있는 클라이언트를 선택한다.
```

### 통신 종류(채널 설정)

<font size=2>socket.io가 지원하는 통신 종류는 총 3가지이다.</font><br />
<font size=2>사실 모든 소켓 통신의 기본 방식이기 때문에 3가지 방식을 기반으로 모든 웹 서비스를 설계한다고 생각하면 된다.</font><br />

```
 • private
 • public
 • broadcast
```

#### private

<font size=2>private은 1:1 통신을 말한다. 메신저를 예로 들면 1:1 채팅이다.</font><br />

```
 io.sockets.to(사용자 id).emit()
```

#### public

<font size=2>전송자를 포함한 모두에게 메시지를 전송한다.</font><br />
<font size=2>이 말은 만약 'Hello'라는 메시지를 서버로 전송했다면 서버는 이 메시지를 보낸 사람 구분 없이 모두에게 전송한다.</font><br />

```
 io.sockets.emit()
```

#### broadcast

<font size=2>전송자를 제외한 모든 사용자에게 메시지를 전송한다.</font><br />

```
 socket.broadcast.emit()
```

### socket.io 구현

<font size=2>socket.io의 특징과 대표적인 함수를 알아봤다.</font><br />
<font size=2>새로운 기술을 학습하는 데 실습만큼 좋은 선생은 없다.</font><br />
<font size=2>그래서 학습한 기능을 토대로 채팅 서비스를 만들어보겠다.</font><br />
<font size=2>우리가 만들 채팅 서비스는 앞에서 미리 만들어본 WebChat의 UI를 그대로 사용할 예정이다.</font><br />
<font size=2>또한 점진적으로 개선하면서 socket.io의 주요한 특징인 private, broadcast, public 채널을 알아보겠다.</font><br />

### public IOchat

<font size=2>우리가 작성할 채팅 서비스는 IOchat이라는 채팅 서비스이다.</font><br />
<font size=2>기존에 작성했던 WebChat과 동일한 UI로 작성했다.</font><br />
<font size=2>IOchat을 구현하면서 socket.io에서 제공하는 public 통신을 알아볼 예정이다.</font><br />
<font size=2>먼저 프로젝트 설명부터 시작하겠다.</font><br />

### 프로젝트 초기 설정

<font size=2>IOchat을 만들 폴더를 생성하고 그 아래에 client와 server 폴더를 만든다.</font><br />

```
> mkdir IOchat
> cd IOchat
> mkdir client
> mkdir server
```

<font size=2>기존에 만들었던 리엑트 프로젝트와 동일하게 CRA를 이용해서 client 폴더를 생성한다.</font><br />

### 클라이언트 사이드

<font size=2>이제 클라이언트 사이드부터 구현을 시작하겠다.</font><br />
<font size=2>앞에서 진행했던 프로젝트와 동일하게 client 폴더에 사용하지 않는 파일과 폴더를 삭제한다.</font><br />

```
- App.test.js
- logo.svg
- reportWebVitals.js
- setupTests.js
```

<font size=2>마지막으로 images 폴더를 생성해서 처음 진입할 때 보여지는 이미지 파일을 추가하겠다.</font><br />

```
> cd client/src/
> mkdir images
```

```
이미지 파일 확인하기

프로젝트에 사용되는 파일은 깃허브 주소를 참고하면 된다.

 • https://github.com/devh-e/socket-programming-using-react/blob/master/part1/socket.io/IOchat/client/src/images/iologo.png
```

### App.js

```
필요한 라이브러리
 • socket.io-client(4.6.1): 브라우저에서 socket.io를 사용하기 위한 라이브러리이다.

설치
 > npm install socket.io-client
```

<font size=2>라이브러리까지 준비가 완료됐다면 App.js를 작성하겠다.</font><br />

```
import React, { useRef, useEffect, useState } from "react";
import './App.css';
import logo from "./images/iologo.png";
// 1
import { io } from "socket.io-client";

// 2
const webSocket = io("http://localhost:5000");

const App = () => {
  // 3
  const messagesEndRef = useRef(null);
  const [ userId, setUserId ] = useState("");
  const [ isLogin, setIsLogin ] = useState(false);
  const [ msg, setMsg ] = useState("");
  const [ msgList, setMsgList ] = useState([]);

  // 4
  useEffect(() => {
    if ( !webSocket ) return;

    const sMessageCallback = (msg) => {
      const { data, id } = msg;
      setMsgList((prev) => [
        ...prev,
        {
          msg: data,
          type: "other",
          id: id,
        },
      ]);
    }

    webSocket.on("sMessage", sMessageCallback);

    return () => {
      webSocket.off("sMessage", sMessageCallback);
    };
  }, []);

  // 5
  useEffect(() => {
    if ( !webSocket ) return;

    const sLoginCallback = (msg) => {
      setMsgList((prev) => [
        ...prev,
        {
          msg: `${msg} joins the chat`,
          type: "welcome",
          id: "",
        },
      ]);
    }

    webSocket.on("sLogin", sLoginCallback);

    return () => {
      webSocket.off("sLogin", sLoginCallback);
    }
  }, []);

  // 6
  useEffect(() => {
    scrollToBottom();
  }, [msgList]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 7
  const onSubmitHandler = (e) => {
    e.preventDefault();
    webSocket.emit("login", userId);
    setIsLogin(true);
  };

  // 8
  const onChangeUserIdHandler = (e) => {
    setUserId(e.target.value);
  };

  // 9
  const onSendSubmitHandler = (e) => {
    e.preventDefault();
    const sendData = {
      data: msg,
      id: userId,
    };
    webSocket.emit("message", sendData);
    setMsgList((prev) => [...prev, { msg: msg, type: "me", id: userId }]);
    setMsg("");
  };

  // 10
  const onChangeMsgHandler = (e) => {
    setMsg(e.target.value);
  };

  return (
    <div className="app-container">
      <div className="wrap">
        {isLogin ? (
          // 11
          <div className="chat-box">
            <h3>Login as a "{userId}"</h3>
            <ul className="chat">
              {msgList.map((v, i) => 
                v.type === "welcome" ? (
                  <li className="welcome">
                    <div className="line" />
                    <div>{v.msg}</div>
                    <div className="line" />
                  </li>
                ) : (
                  <li className={v.type} key={`${i}_li`}>
                    <div className="userId">{v.id}</div>
                    <div className={v.type}>{v.msg}</div>
                  </li>
                )
              )}
              <li ref={messagesEndRef} />
            </ul>
            <form
              className="send-form"
              onSubmit={onSendSubmitHandler}
            >
              <input 
                placeholder="Enter your Message"
                onChange={onChangeMsgHandler}
                value={msg}
              />
              <button type="submit">send</button>
            </form>
          </div>
        ) : (
          // 11
          <div className="login-box">
            <div className="login-title">
              <img 
                src={logo}
                width={40}
                height={40}
                alt="logo"
              />
              <div>IOChat</div>
            </div>
            <form className="login-form" onSubmit={onSubmitHandler}>
              <input 
                placeholder="Enter your ID"
                onChange={onChangeUserIdHandler}
                value={userId}
              />
              <button type="submit">Login</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
```

<font size=2>먼저 만들었던 WebChat과 동일하다. socket.io를 제외한 부분은 빠르게 지나가겠다.</font><br />

<font size=2>1. socket.io-client를 불러와 io객체를 생성한다.</font><br />
<font size=2>io 객체를 이용해서 socket.io의 다양한 기능을 구현할 수 있다.</font><br /><br />

<font size=2>2. socket.io를 초기화하는 작업이다.</font><br />
<font size=2>우리가 소켓 통신할 URL 주소를 io 객체에 할당한다.</font><br />
<font size=2>이제부터 webSocket이라는 변수를 이용해서 소켓 통신이 이루어진다.</font><br />

```
const webSocket = io("http://localhost:5000");
```

```
ws:// 프로토콜 없이도 연결이 가능한가?

socket.io에서는 웹 소켓 API와 다르게 ws:// 없이 소켓을 연결했다.
앞에서 설명한 것처럼 socket.io는 웹 소켓의 구현체가 아니지 때문에 프로토콜 없이 연결할 수 있다.
```

```
꼭 함수 밖에서 socket.io 객체를 초기화해야 하나?

꼭 그래야 하는 건 아니다.
리액트에 있는 useRef, useState를 이용해서 socket.io 객체를 생성할 수 있다.
그러나 useRef, useState를 이용해서 초기화할 경우 코드 작성 위치에 따라서 소켓 통신이 되지 않을 수 있다.
예를 들어 다음과 같이 useRef로 만든 코드가 있다고 가정하겠다.

// 1
useEffect(() => {
  if ( !socketIo.current ) return;
  socketIo.current.emit("join", documentId);
}, []);

// 2
useEffcet(() => {
  socketIo.current = io("http://localhost:5000");
}, []);

이렇게 초기화를 뒤에 작성할 경우 앞에 작성된 socketIo의 코드는 실행되지 않을 수도 있다.
그래서 socket.io에서는 socket 객체를 외부 파일로 작성해서 불러오는 방법을 추천한다.

자세한 내용은 Part 2 실전 편에서 다루겠다.
```
<br />

<font size=2>3. 우리가 사용할 변수를 state와 ref로 할당했다.</font><br /><br />
<font size=2>4. 서버에서 오는 메시지를 받는 이벤트 리스너를 정의했다.</font><br />
<font size=2>이벤트는 'sMessage'로 받을 수 있다.</font><br />
<font size=2>이벤트로 메시지를 받으면 위에서 미리 정의한 setMsgList에 저장해서 채팅 리스트로 출력한다.</font><br />
<font size=2>전송 받은 데이터 중 type 값을 이용해서 type에 맞는 스타일 처리를 한다.</font><br />

```
return () => {
  webSocket.off("sMessage", sMessageCallback);
}

useEffect로 등록된 이벤트 리스너는 off()를 이용해서 해제하는 작업이 필요하다.
```
<br />

<font size=2>5. 로그인을 할 때 아이디를 받는 'sLogin' 이벤트를 등록한다.</font><br />
<font size=2>이번에는 type 값이 'welcome'으로 오게 되면 'Tom joins the chat'이라는 문구를 채팅창에 출력한다.</font><br />

```
socket.io 이벤트 등록은 부모 컴포넌트, 자식 컴포넌트 중 어디서 해야 하나?

우리 예제에서는 서버 메시지를 받기 위한 이벤트 등록을 우리가 가지고 있는 단일 컴포넌트인 App.js에 작성했다.
그러나 만약 규모가 커지면 부모와 자식으로 컴포넌트를 구분하는 일이 발생한다.
예를 들어 폼 컴포넌트와 그 하위의 자식 컴포넌트인 버튼 컴포넌트와 같은 구조이다.

- src
  ↳ FormComponent
   ↳ ButtonComponent

위와 같은 상황에서는 버튼 컴포넌트에 이벤트 등록이 필요하다면 직접 버튼 컴포넌트에 하기보다는 그 상위의 부모 컴포넌트에 이벤트를 등록하는 걸 추천한다.
자식 컴포넌트는 화면에 렌더링되었다가 사라질 수도 있기 때문이다.
만약 해당 버튼 컴포넌트가 소켓 이벤트 연결 이후 사라진다면 서버에서 전송된 메시지가 없어지는 현상을 겪을 수 있다.
```
<br />

<font size=2>6. 채팅창의 대화 목록이 자연스럽게 내려가도록 한다.</font><br /><br />
<font size=2>7. 로그인할 때에 아이디를 소켓 서버로 전송한다.</font><br /><br />

```
webSocket.emit("login", userId);

전송할 때는 emit() 메소드를 사용한다.
```

<font size=2>8. 아이디 input 박스의 핸들러이다.</font><br /><br />
<font size=2>9. 채팅 문구를 전송하는 함수이다.</font><br />

```
const sendData = {
  data: msg,
  id: userId,
};
webSocket.emit("message", sendData);

전송 데이터로 사용자의 아이디 값을 함께 전송하여 어떤 사람이 대화를 남겼는지 확인하도록 했다.
```
<br />

<font size=2>10. 채팅 input 박스 핸들러이다.</font><br /><br />
<font size=2>11. isLogin 이라는 상태값으로 로그인 화면인지 채팅 화면인지 구분한다.</font><br /><br />

### App.css

```
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.app-container > .wrap > .login-box > .login-title {
  display: flex;
  flex-direction: row;
  font-size: 2rem;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.app-container > .wrap > .login-box > .login-title > img {
  border-radius: 50%;
}
.app-container > .wrap > .login-box > .login-form {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-top: 20px;
}
.app-container > .wrap > .login-box > .login-form input {
  width: 100%;
  border: 0;
  padding: 10px;
  border-radius: 5px;
  background-color: #f6f6f6;
}
.app-container > .wrap > .login-box > .login-form > button {
  border: 0;
  padding: 10px;
  border-radius: 5px;
  background-color: #00d8ff;
  color: #fff;
}
.app-container > .wrap > .chat-box .chat {
  list-style: none;
  padding: 10px;
  margin: 0;
  border: 1px solid #cecece;
  border-radius: 10px;
  width: 300px;
  height: 300px;
  overflow: auto;
}
.app-container > .wrap > .chat-box .chat li.me {
  text-align: left;
}
.app-container > .wrap > .chat-box .chat li.other {
  text-align: right;
}
.app-container > .wrap > .chat-box .chat li.welcome {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
  gap: 10px;
}
.app-container > .wrap > .chatbox .chat li.welcome > .line {
  height: 0.5px;
  flex: 1 1 auto;
  padding: 0 10px;
  background-color: #cecece;
}
.app-container > .wrap > .chat-box .chat div.me {
  padding: 5px;
  display: inline-block;
  border-top-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background-color: #cecece;
}
.app-container > .wrap > .chat-box .chat div.other {
  padding: 5px;
  display: inline-block;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background-color: #000;
  color: #fff;
}
.app-container > .wrap > .chat-box .chat .userId {
  margin-top: 5px;
  font-size: 13px;
  font-weight: bold;
}
.app-container > .wrap > .chat-box .send-form {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
}
.app-container > .wrap > .chat-box .send-form input {
  width: 100%;
  border: 0;
  padding: 10px;
  border-radius: 5px;
  background-color: #f6f6f6;
}
.app-container > .wrap > .chat-box .send-form button {
  border: 0;
  padding: 10px;
  border-radius: 5px;
  background-color: #00d8ff;
}
```

### 서버 사이드

<font size=2>이번에는 server.js를 만들겠다.</font><br />
<font size=2>server 폴더로 이동한 후에 server.js 파일을 생성해준다.</font><br />

<font size=2>또 socket.io 라이브러리를 사용하기 때문에 npm이 필요하다.</font><br />
<font size=2>npm을 이용해서 package.json을 생성하겠다.</font><br />

```
npm init
```

### server.js

```
필요한 라이브러리

 • socket.io: socket.io를 사용하기 위한 소켓 라이브러리이다.
```

<font size=2>이제 server.js를 만들면서 socket.io를 설치하겠다.</font><br />
<font size=2>npm 명령어를 통해서 socket.io를 설치한다.</font><br />

```
npm install socket.io
```

<font size=2>이제 본격적으로 server.js를 구현하겠다.</font><br />

```
// 1
const { Server } = require("socket.io");

// 2
const io = new Server("5000", {
  cors: {
    origin: "http://localhost:3000",
  },
});

// 3
io.sockets.on("connection", (socket) => {
  // 4
  socket.on("message", (data) => {
    // 5
    io.sockets.emit("sMessage", data);
  });

  socket.on("login", (data) => {
    io.sockets.emit("sLogin", data);
  });

  // 6
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
```

<font size=2>1. socket.io를 프로젝트에 추가한다.</font><br />
<font size=2>Server라는 생성자를 이용해 소켓 서버를 생성한다.</font><br /><br />

<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />