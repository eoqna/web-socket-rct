### 클라이언트 사이드 (266p)

```
필요한 라이브러리

 • @emotion/react
  - emotionjs는 CSS 스타일을 위한 라이브러리이다.
  - emotionjs를 이용해서 module.css와 scss 같은 기능을 간편하게 사용할 수 있다.

 • react-icons
  - 아이콘 이미지를 간편하게 사용하기 위한 라이브러리이다.

 • react-quill
  - quill을 이용하면 우리가 흔히 사용하는 블로그와 문서 형식의 웹 서비스를 간편하게 제작할 수 있다.

 • react-router-dom
  - 리액트 라우팅을 위해 사용한다.

 • socket.io-client
  - 브라우저의 소켓 통신을 위해 사용한다.

 • dayjs
  - 현재 채팅 날짜를 표현하기 위해 사용한다.

 • @craco/craco
  - CRACO는 CRA를 쉽게 설정할 수 있는 기능을 제공한다.

 • @emotion/babel-preset-css-props
  - emotionjs를 사용하기 위한 바벨 설정 파일이다.
```

<font size=2>클라이언트를 위한 라이브러리를 먼저 설치한다.</font><br />

```
 npm install @emotion/react
 npm install react-icons
 npm install react-quill
 npm install react-router-dom
 npm install socket.io-client
 npm install dayjs
 npm install @craco/craco --dev
 npm install @emotion/babel-preset-css-prop --dev
```

<font size=2>설치하는 과정에서 --dev라는 설정값이 추가됐다.</font><br />
<font size=2>--dev 명령어로 설치된 라이브러리는 package.json의 'devDependencies'로 관리된다.</font><br />
<font size=2>또한 production으로 배포될 때 빌드되는 파일에는 포함하지 않는 특징을 가지고 있다.</font><br />
<font size=2>스타일 라이브러리인 emotionjs를 CRA에서 사용하기 위한 CRACO 라이브러리 설정이 필요하다.</font><br />
<font size=2>루트 디렉터리인 client에서 craco.config.js 파일을 생성한다.</font><br />
<font size=2>아래 코드를 그대로 작성해준다.</font><br />

```
module.exports = {
  babel: {
    presets: ['@emotion/babel-preset-css-prop'],
  },
};
```

<font size=2>이제 클라이언트 프로젝트를 위한 모든 준비는 끝났다.</font><br />
<font size=2>소켓 설정부터 하나씩 진행하겠다.</font><br />

### socket.js (269p)

<font size=2>src 폴더 아래 socket.js 파일을 생성한다.</font><br />
<font size=2>채팅을 하기 위한 소켓 설정이다.</font><br />
<font size=2>슬랙에서는 개인 메시지, 그룹 메시지, 공통 로직을 위한 네임스페이스를 정의한다.</font><br />

```
import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  autoConnect: false,
});

// 1
export const socketPrivate = io("http://localhost:5000/private", {
  autoConnect: false,
});

// 2
export const socketGroup = io("http://localhost:5000/group", {
  autoConnect: false,
});
```

<font size=2>1~2. private와 group 네임스페이스를 생성했다.</font><br />
<font size=2>소켓 연결이 자동으로 되지 않도록 autoConnect:false로 설정한다.</font><br /><br />

### context (270p)

<font size=2>슬랙 채팅에서는 다양한 컴포넌트와 컨테이너 영역에 데이터를 전달할 수 있도록 전역 변수를 설정할 예정이다.</font><br />
<font size=2>전역 변수 설정을 위해 Context API를 사용하겠다.</font><br />
<font size=2>src 폴더 아래 context 폴더를 만든 후 그 아래에 action.js와 index.js 파일을 생성한다.</font><br />

### action.js (270p)

<font size=2>Context API를 실행하기 위한 액션을 설정한다.</font><br />

```
export const AUTH_INFO = "AUTH_INFO";
export const USER_LIST = "USER_LIST";
export const GROUP_LIST = "GROUP_LIST";
export const CURRENT_CHAT = "CURRENT_CHAT";
export const GROUP_CHAT = "GROUP_CHAT";
```

### index.js (271p)

```
import { createContext, useReducer } from "react";
import {
  AUTH_INFO,
  USER_LIST,
  CURRENT_CHAT,
  GROUP_CHAT,
  GROUP_LIST,
} from "./action";

// 1
const initialState = {
  loginInfo: {
    userId: "",
    socketId: "",
  },
  userList: [],
  groupList: [],
  currentChat: {
    targetId: [],
    roomNumber: "",
    targetSocketId: "",
  },
  groupChat: {
    textBarStatus: false,
    groupChatNames: [],
  },
};

const Context = createContext({});

// 2
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_INFO:
      return {
        ...state,
        loginInfo: action.payload,
      };
    case USER_LIST:
      return {
        ...state,
        userList: action.payload,
      };
    case GROUP_LIST:
      return {
        ...state,
        groupList: action.payload,
      };
    case CURRENT_CHAT:
      return {
        ...state,
        currentChat: action.payload,
      };
    case GROUP_CHAT:
      return {
        ...state,
        groupChat: action.payload,
      };
    default:
      return state;
  }
};

const StoreProvider = ({ children }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Context.Provider value={value}>{children}</Context.Provider>
};

export { Context, StoreProvider };
```

<font size=2>1. 전역 변수의 초기값이다.</font><br />
<font size=2>전역 변수로는 현재 접속한 사용자의 정보, 사용자 리스트, 그룹 채팅 활성화 등이 있다.</font><br /><br />

<font size=2>2. 전역 변수를 업데이트하기 위한 switch 문이다.</font><br /><br />

### containers (273p)

<font size=2>컨테이너에는 처음 로그인 화면과 소켓 연결 공통 로직을 불러오기 위한 설정을 한다.</font><br />
<font size=2>먼저 로그인 페이지부터 구현하겠다.</font><br />
<font size=2>src 폴더에 containers 폴더를 만들고 그 아래에 IndexContainer 폴더를 생성한다.</font><br />
<font size=2>마지막으로 IndexContainer 폴더 아래에 IndexContainer.js와 IndexContainer.style.js 파일을 만든다.</font><br />

### IndexContainer.js (274p)

```
import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import {
  indexContainerCss,
  loginWrapCss,
  headerCss,
  loginFormCss,
  inputCss,
  btnCss,
} from "./IndexContainer.style";
// 1
import { socket, socketPrivate, socketGroup } from "../../socket";
import { useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";

const IndexContainer = () => {
  const [ user, setUser ] = useState("");
  const navigate = useNavigate();

  // 2
  useEffect(() => {
    socket.on("connect_error", (err) => {
      if( err.message === "invalid username") {
        console.log("err");
      }
    });
  }, []);

  // 3
  const onLoginHandler = (e) => {
    e.preventDefault();

    if( !user ) return;

    socket.auth = { userId: user };
    socket.connect();

    socketPrivate.auth = { userId: user };
    socketPrivate.connect();

    socketGroup.auth = { userId: user };
    socketGroup.connect();
    navigate("/main");
  };

  // 4
  const onUserNameHandler = (e) => {
    setUser(e.target.value);
  };

  return (
    <div css={indexContainerCss}>
      <div css={loginWrapCss}>
        <h1 css={headerCss}>
          <img src={logo} width={100} height="auto" alt="logo"  />
        </h1>
        <form css={loginFormCss} onSubmit={onLoginHandler}>
          <input 
            css={inputCss}
            type="text"
            value={user}
            placeholder="Enter your ID"
            onChange={onUserNameHandler}
          />
          <button onClick={onLoginHandler} css={btnCss}>
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
};

export default IndexContainer;
```

<font size=2>1. 미리 설정한 socket.io의 네임스페이스 객체를 불러온다.</font><br />
<font size=2>또한 sign in 버튼을 클릭하면 메인 페이지로 이동하기 위해 useNavigate라는 훅을 추가했다.</font><br /><br />

<font size=2>2. 만약 userId를 서버에 넘기지 않고 로그인했다면 오류 콜백을 받을 수 있는 함수를 정의했다.</font><br /><br />

<font size=2>3. sign in 버튼을 클릭하면 실행된다.</font><br />
<font size=2>각각의 네임스페이스에 동일한 userId를 추가했다.</font><br />
<font size=2>이렇게 설정한 이유는 네임스페이스마다 고유한 socketId가 부여되는 별개의 환경이기 때문에 이렇게 설정되었다.</font><br /><br />

<font size=2>4. 사용자 아이디를 작성하는 함수이다.</font><br /><br />

### IndexContainer.style.js (276p)

```
import { css } from "@emotion/react";

export const indexContainerCss = css`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const loginWrapCss = css`
  width: 300px;
  height: 300px;
  display: flex;
  flex-direction: column;
`;

export const headerCss = css`
  text-align: center;
`;

export const loginFormCss = css`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  width: 100%;
`;

export const inputCss = css`
  width: calc(100% - 22px);
  border: 1px solid #cecece;
  padding: 10px;
  border-radius: 5px;
`;

export const btnCss = css`
  width: 100%;
  border: 0;
  padding: 10px;
  border-radius: 5px;
  background-color: #4a154b;
  color: white;
  font-weight: bold;
  cursor: pointer;
`;
```

### MainContainer.js (277p)

<font size=2>MainContainer에서는 소켓 연결 해제와 공통 데이터를 가져오는 작업을 한다.</font><br />
<font size=2>여기서 말하는 공통 데이터는 사용자 리스트 정보와 그룹 대화방 리스트이다.</font><br /><br />

<font size=2>IndexContainer와 동일하게 containers 폴더 아래로 mainContainer라는 폴더를 생성한다.</font><br />
<font size=2>바로 아래 MainContainer.js와 MainContainer.style.js 파일을 만든다.</font><br />

```
import React, { useEffect, useState, useContext } from "react";
import { css } from "@emotion/react";
import {
  mainContainerCss,
  slackMainCss,
  slackHeaderCss,
  slackWindowCss,
  mainContentCss,
} from "./MainContainer.style";
import { socket, socketPrivate, socketGroup } from "../../socket";
import { SideBar, ChatRoom } from "../../components";
import { USER_LIST, AUTH_INFO, GROUP_LIST } from "../../context/action";
import { Context } from "../../context";

const MainContainer = () => {
  // 1
  const {
    state: { loginInfo },
    dispatch,
  } = useContext(Context);

  // 2
  useEffect(() => {
    socket.on("connect", () => {
      dispatch({
        type: AUTH_INFO,
        payload: {
          userId: socket.auth.userId,
          socketId: socket.id,
        },
      });
    });

    return () => {
      socket.disconnect();
      socketPrivate.disconnect();
      socketGroup.disconnect();
    };
  }, []);

  // 3
  useEffect(() => {
    function setUserListHandler(data) {
      dispatch({
        type: USER_LIST,
        payload: data || [],
      });
    };

    socketGroup.on("user-list", setUserListHandler);

    return () => {
      socket.off("user-list", setUserListHandler);
    };
  }, []);
  
  // 4
  useEffect(() => {
    function setGroupListHandler(data) {
      dispatch({
        type: GROUP_LIST,
        payload: data || [],
      });
    };

    socketGroup.on("group-list", setGroupListHandler);

    return () => {
      socket.off("group-list", setGroupListHandler);
    };
  }, []);

  useEffect(() => {
    function setGroupListHandler(data) {
      dispatch({
        type: GROUP_LIST,
        payload: data || [],
      });
    };

    socketGroup.on("group-list", setGroupListHandler);

    return () => {
      socket.off("group-list", setGroupListHandler);
    };
  }, []);

  return (
    <div css={mainContainerCss}>
      <div css={slackMainCss}>
        <header css={slackHeaderCss}>
          <ul css={slackWindowCss}>
            <li className="red"></li>
            <li className="orange"></li>
            <li className="green"></li>
          </ul>
          <div className="user">{loginInfo.userId}</div>
        </header>
        <article css={mainContainerCss}>
          <SideBar />
          <ChatRoom />
        </article>
      </div>
    </div>
  );
};

export default MainContainer;
```

<font size=2>1. useContext() 훅을 이용해서 전역 변수로 선언된 loginInfo 변수를 불러온다.</font><br /><br />

<font size=2>2. 소켓이 연결되면 'connect'라는 이벤트로 콜백을 받는다.</font><br />
<font size=2>콜백 안에는 socket 객체에 선언된 userId 값을 가지고 있다.</font><br />
<font size=2>이 값을 전역 변수에 선언할 예정이다.</font><br />
<font size=2>마지막으로 MainContainer가 언마운트되면 소켓 연결을 해제한다.</font><br /><br />

<font size=2>3. 'user-list'라는 소켓 이벤트로 mongoDB에 저장된 사용자 리스트를 받아온다.</font><br />
<font size=2>사용자 리스트 또한 전역 변수에 저장한다.</font><br /><br />

<font size=2>4. 'group-list' 소켓 이벤트로 그룹 대화방에 해당하는 그룹 리스트를 받아온다.</font><br /><br />

### MainContainer.style.js (281p)

```
import { css } from "@emotion/react";

export const mainContainerCss = css`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const slackMainCss = css`
  display: flex;
  flex-direction: column;
  /* height: 60vh; */
  width: 100%;
  max-width: 1000px;
  border: 1px solid #4a154b;
  border-radius: 5px;
`;

export const slackHeaderCss = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  width: calc(100% - 40px);
  background-color: #340e36;
  .user {
    color: #fff;
    font-weight: bold;
  }
`;

export const slackWindowCss = css`
  display: flex;
  flex-direction: row;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;

  li.green {
    cursor: pointer;
    background-color: #26c840;
    border-radius: 50%;
    width: 10px;
    height: 10px;
  }
  li.red {
    cursor: pointer;
    background-color: #fe5f58;
    border-radius: 50%;
    width: 10px;
    height: 10px;
  }
  li.orange {
    cursor: pointer;
    background-color: #febc2e;
    border-radius: 50%;
    width: 10px;
    height: 10px;
  }
`;

export const mainContentCss = css`
  display: flex;
  flex-direction: row;
  height: 100%;
`;
```

<font size=2>마지막으로 작성한 컨테이너를 쉽게 불러올 수 있도록 containers 폴더에 index.js를 작성한다.</font><br />
<font size=2>containers 폴더로 이동한 후에 index.js를 생성한다.</font><br />

### index.js (283p)

```
export { default as IndexContainer } from "./IndexContainer/IndexContainer";
export { default as MainContainer } from "./MainContainer/MainContainer";
```

### components (283p)

<font size=2>다음으로 슬랙 메신저에서 사용할 컴포넌트를 작성할 차례이다.</font><br />
<font size=2>src 폴더 아래 components라는 폴더를 만든다.</font><br />
<font size=2>그 아래에 하나씩 컴포넌트를 작성하겠다.</font><br />

### User.js (284p)

<font size=2>user 컴포넌트는 왼쪽에 표시되는 사용자 아이디와 접속 여부를 표현한다.</font><br />
<font size=2>components 폴더 아래 user라는 폴더를 생성한다.</font><br />
<font size=2>user 폴더에 User.js와 User.style.js라는 파일을 생성하겠다.</font><br />

```
import { css } from "@emotion/react";
import { userCss } from "./User.style";

const User = ({ id, status, onClick, socket, type }) => {
  return (
    <div
      css={userCss}
      data-id={id}
      data-type={type}
      data-socket={socket}
      data-status={status}
      onClick={onClick}
    >
      <span className={status ? "active" : "deactive"} />
      <span
        data-type={type}
        className="user"
        data-id={id}
        data-socket={socket}
        data-status={status}
      >
        {id}
      </span>
    </div>
  );
};

export default User;
```

<font size=2>1. User 컴포넌트는 접속 상태를 표현하기 위한 status 값을 받는다.</font><br />
<font size=2>또한 각각의 socket 아이디 값을 할당받아 클릭하면 어떤 채팅방에 속해 있는지 여부를 확인할 수 있도록 했다.</font><br /><br />

### User.style.js (285p)

```
import { css } from "@emotion/react";

export const userCss = css`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  color: #cecece;
  font-size: 14px;
  padding: 7px 20px;
  cursor: pointer;
  &:hover {
    background-color: rgba(234, 234, 234, 0.2);
  }
  .action {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #29ac76;
  }
  .deactive {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    border: 1px solid #cecece;
  }
`;
```

### TextEditor.js (286p)

<font size=2>TextEditor 컴포넌트는 채팅을 입력할 수 있는 창이다.</font><br />
<font size=2>앞에서 미리 사용한 react-quill을 변형해서 간편하게 사용할 예정이다.</font><br />
<font size=2>components 폴더 아래 textEditor 폴더를 만들고 TextEditor.js와 TextEditor.style.js 파일을 생성한다.</font><br />

```
// 1
import { css } from "@emotion/react";
import { containerCss, sendCss }  from "./TextEditor.style";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { HiPaparAirplane } from "react-icons/hi2";

// 2
const modules = {
  toolbar: {
    container: [
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike" ],
      [{ script: "sub" }, { script: "super" }],
    ],
  },
};

const TextEditor = ({
  text,
  onChangeTextHandler,
  reactQuillRef,
  onSendHandler,
}) => {
  return (
    <div css={containerCss}>
      <HiPaparAirplane css={sendCss} onClick={onSendHandler} />
      <ReactQuill
        theme="snow"
        modules={modules}
        value={text}
        onChange={onChangeTextHandler}
        ref={(el) => {
          reactQuillRef.current = el;
        }}
      ></ReactQuill>
    </div>
  );
};

export default TextEditor;
```

<font size=2>1. input 박스를 만들기 위한 react-quill을 불러온다.</font><br />
<font size=2>또한 quill의 snow 스타일을 적용하기 위해 quill, snow.css도 적용했다.</font><br /><br />

<font size=2>2. react-quill 박스에 포함될 모듈을 설정한다.</font><br />
<font size=2>슬랙과 비슷한 모양을 만들기 위해 간단하게 설정한다.</font><br /><br />

### TextEditor.style.js (288p)

```
import { css } from "@emotion/react";

export const containerCss = css`
  position: relative;
  width: 800px;
  .quill {
    margin: 20px;
    background-color: #fff;
    border: 1px solid #cecece;
    border-radius: 15px;
  }
  .qi-container.ql-snow {
    border: none;
    display: flex;
  }
  .ql-container.ql-editor {
    width: 100%;
  }
  .ql-toolbar.ql-snow {
    width: calc(100% - 30px);
    border-top-left-radius: 15px;
    border-top-rigth-radius: 15px;
    display: flex;
    position: sticky;
    top: 0;
    z-index: 1;
    border: none;
  }
`;

export const sendCss = css`
  position: absolute;
  right: 30px;
  top: 30px;
  height: 25px;
  width: 25px;
  color: #29ac76;
  cursor: pointer;
`;
```

### GroupTextInput.js (289p)

<font size=2>GroupTextInput은 단체방을 만들기 위해 사용자를 초대하는 input 박스이다.</font><br />
<font size=2>슬랙의 Direct Messages라는 버튼을 누르면 활성화된다.</font><br />
<font size=2>위 컴포넌트와 동일하게 components 폴더 아래 groupTextInput 폴더를 추가하고 GroupTextInput.js와 GroupTextInput.style.js 파일을 만든다.</font><br />

```
import { css } from "@emotion/react";
import {
  groupTextContainerCss,
  titleCss,
  inputCss,
  groupFormCss,
  nameBoxCss,
  tagCss,
  joinBtnCss,
} from "./GroupTextInput.style";

// 1
const GroupTextInput = ({
  groupText,
  onChangeGroupTextHandler,
  onGroupSendHandler,
  groupChatUserList,
  groupChatUserCloseClick,
  onJoinClick
}) => {
  return (
    <div css={groupTextContainerCss}>
      <span css={titleCss}>to:</span>
      <ul css={nameBoxCss}>
        {
          // 2
          groupChatUserList.map((v, i) => (
            <li css={tagCss} key={`${i}-${v}`}>
              {v}
              <span
                className="close"
                data-id={v}
                onClick={groupChatUserCloseClick}
              >
                x
              </span>
            </li>
          ))
        }
      </ul>
      <form onSubmit={onGroupSendHandler} css={groupFormCss}>
        <input
          type="text"
          value={groupText}
          css={inputCss}
          onChange={onChangeGroupTextHandler}
          onChangeGroupTextHandler={onChangeGroupTextHandler}
        />
      </form>
      <button css={joinBtnCss} onClick={onJoinClick}>
        Join
      </button>
    </div>
  )
};

export default GroupTextInput;
```

<font size=2>1-2. 그룹 채팅은 많은 사용자가 참여하기 때문에 사용자 값을 리스트로 전달받는다.</font><br />
<font size=2>그 리스트를 순회하면서 추가한 사용자의 아이디 값을 노출하게 했다.</font><br />

### Chatroom.js (291p)

<font size=2>가장 중요한 컴포넌트인 Chatroom.js와 SideBar.js는 layout이라는 폴더를 만들어서 따로 관리하겠다.</font><br />
<font size=2>components 폴더 아래에 layout 폴더를 추가하고 그 아래 chatRoom이라는 폴더를 만든다.</font><br />
<font size=2>그리고 ChatRoom.js와 ChatRoom.style.js 파일을 생성한다.</font><br />

```
import React, { useState, useContext, useEffect, useRef } from "react";
import { css } from "@emotion/react";
import { Context } from "../../../context";
import {
  chatRootWrapCss,
  subTitleCss,
  chatBoxCss,
  chatBoxGuidCss,
  chatCss,
} from "./ChatRoom.style";
import { TextEditor, GroupTextInput } from "../../index";
import { socketPrivate, socketGroup } from "../../../socket";
import logo from "../../../images/logo.png";
import dayjs from "dayjs";

// 1
const ChatRoom = () => {
  const {
    state: { currentChat, loginInfo, groupChat, userList },
  } = useContext(Context);
  const reactQuillRef = useRef(null);
  const [ text, setText ] = useState("");
  const [ groupUser, setGroupUser ] = useState("");
  const [ msgList, setMsgList ] = useState([]);
  const [ groupChatUsers, setGroupChatUsers ] = useState([]);

  // 2
  useEffect(() => {
    function setPrivateMsgListHandler(data) {
      const { msg, fromUserId, toUserId, time } = data;
      if (
        currentChat.roomNumber === `${fromUserId}-${toUserId}` ||
        currentChat.roomNumber === `${toUserId}-${fromUserId}`
      ) {
        setMsgList((prev) => [
          ...prev,
          {
            msg: msg,
            userId: fromUserId,
            time,
          },
        ]);
      }
    }
    socketPrivate.on("private-msg", setPrivateMsgListHandler);

    return () => {
      socketPrivate.off("private-msg", setPrivateMsgListHandler);
    };
  }, [currentChat.roomNumber]);

  // 3
  useEffect(() => {
    function setGroupMsgListHandler(data) {
      const { msg, toUserSocketId, fromUserId, time } = data;
      if (currentChat.roomNumber === toUserSocketId) {
        setMsgList((prev) => [
          ...prev,
          {
            msg: msg,
            userId: fromUserId,
            time,
          },
        ]);
      }
    }
    socketGroup.on("group-msg", setGroupMsgListHandler);

    return () => {
      socketGroup.off("group-msg", setGroupMsgListHandler);
    };
  }, [currentChat.roomNumber]);
  
  // 4
  useEffect(() => {
    function setMsgListInit(data) {
      setMsgList(
        data.msg.map((m) => ({
          msg: m.msg,
          userId: m.fromUserId,
          time: m.time,
        }))
      );
    };
    socketPrivate.on("private-msg-init", setMsgListInit);

    return () => {
      socketPrivate.off("private-msg-init", setMsgListInit);
    };
  }, []);

  // 5
  useEffect(() => {
    function setGroupMsgListInit(data) {
      setMsgList(
        data.msg.map((m) => ({
          msg: m.msg,
          userId: m.fromUserId,
          time: m.time,
        }))
      );
    };
    socketGroup.on("group-msg-init", setGroupMsgListInit);

    return () => {
      socketGroup.off("group-msg-init", setGroupMsgListInit);
    };
  }, []);

  // 6
  useEffect(() => {
    return () => {
      setMsgList([]);
    };
  }, [currentChat.roomNumber]);

  // 7
  const onPrivateMsgSendHandler = () => {
    const msg = reactQuillRef.current.unprivilegedEditor.getText();
    const currentTime = dayjs().format("HH:mm a");

    setMsgList((prev) => [
      ...prev,
      {
        msg: msg,
        userId: loginInfo.userId,
        time: currentTime,
      },
    ]);

    socketPrivate.emit("privateMsg", {
      msg: msg,
      toUserId: currentChat.targetId[0],
      toUserSocketId: currentChat.targetSocketId,
      fromUserId: loginInfo.userId,
      time: currentTime,
    });

    setText("");
  };

  // 8
  const onGroupSendHandler = (e) => {
    e.preventDefault();

    if( !userList.filter((v) => v.userId === groupUser).length > 0 ) {
      alert("The user does not exist.");
      setGroupUser("");
      return;
    }

    if( groupUser === loginInfo.userId ) {
      alert("Please, Choose someone else.");
      setGroupUser("");
      return;
    }

    setGroupChatUsers([...groupChatUsers, groupUser]);
    setGroupUser("");
  };

  // 9
  const onChangeGroupTextHandler = (e) => {
    setGroupUser(e.target.value);
  };

  // 10
  const groupChatUserCloseClick = (e) => {
    const { id } = e.target.dataset;
    setGroupChatUsers(groupChatUsers.filter((v) => v !== id));
  };

  // 11
  const onJoinClick = () => {
    if( groupChatUsers.length <= 0) return;

    const socketId = [...groupChatUsers, loginInfo.userId].join(",");
    const user = {
      socketId: socketId,
      status: true,
      userId: socketId,
      type: "group",
    };

    socketGroup.emit("reqGroupJoinRoom", user);
    setGroupChatUsers([]);
  };

  // 12
  const onGroupMsgSendHandler = () => {
    const msg = reactQuillRef.current.unprivilegedEditor.getText();
    const currentTime = dayjs().format("HH:mm a");
    setMsgList((prev) => [
      ...prev,
      {
        msg: msg,
        userId: loginInfo.userId,
        time: currentTime,
      },
    ]);

    socketGroup.emit("groupMsg", {
      toUserId: currentChat.targetSocketId,
      toUserSocketId: currentChat.targetSocketId,
      fromUserId: loginInfo.userId,
      msg: msg,
      time: currentTime,
    });

    setText("");
  };

  return (
    <article css={chatRootWrapCss}>
        <div css={subTitleCss}>
          {groupChat.textBarStatus ? (
              <GroupTextInput 
                groupText={groupUser}
                onChangeGroupTextHandler={onChangeGroupTextHandler}
                groupChatUserList={groupChatUsers}
                onGroupSendHandler={onGroupSendHandler}
                groupChatUserCloseClick={groupChatUserCloseClick}
                onJoinClick={onJoinClick}
              />
            ) : (
              currentChat.targetId.map((v) => (
                <span className="user">{v}</span>
              ))
            )
          }
        </div>
        {currentChat.roomNumber ? (
            <ul css={chatBoxCss}>
              {msgList.map((v, i) => (
                <li css={chatCss} key={`${i}-chat`}>
                  <div className="userBox">
                    <span className="user">{v.userId}</span>
                    <span className="date">{v.time}</span>
                  </div>
                  <div className="textBox">{v.msg}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div css={chatBoxGuidCss}>
              <img src={logo} width={100} height="auto" alt="logo" />
              <div className="guide">Please, Choose a conversation.</div>
            </div>
          )
        }
        {currentChat.roomNumber && (
          <TextEditor 
            onSendHandler={
              currentChat.targetId.length > 1
                ? onGroupMsgSendHandler
                : onPrivateMsgSendHandler
            }
            text={text}
            reactQuillRef={reactQuillRef}
            onChangeTextHandler={setText}
          />
        )}
    </article>
  )
};

export default ChatRoom;
```

<font size=2>1. 전역 변수로 관리되고 있는 채팅 관련 변수들을 불러온다.</font><br />
<font size=2>chatRoom 컴포넌트는 채팅의 메인 영역에 자리잡고 있기 때문에 노출해야 될 정보가 많다.</font><br />
<font size=2>그만큼 다양한 정보가 필요하다.</font><br /><br />

<font size=2>2. 'private-msg'는 다른 상대가 1:1로 대화한 메시지를 받는 이벤트이다.</font><br />
<font size=2>useEffect() 훅의 콜백으로 방 번호를 설정했다.</font><br /><br />

<font size=2>3. 그룹 메시지를 불러오는 함수이다.</font><br />
<font size=2>개인 메시지와 동일하게 'group-msg'라는 이벤트를 통해서 서버와 그룹 메시지 정보를 가져온다.</font><br /><br />

<font size=2>4. 처음 개인 대화방에 들어가면 과거에 대화했던 내역을 가져오는 함수이다.</font><br />
<font size=2>'private-msg-init'이라는 이벤트가 해당 역할을 한다.</font><br /><br />

<font size=2>5. 단체방에 입장할 때 과거에 대화 내역을 불러오는 함수이다.</font><br />
<font size=2>'group-msg-init'이라는 이벤트로 대화 내역을 불러온다.</font><br /><br />

<font size=2>6. 현재 대화하고 있는 방을 나가면 setMsgList()라는 함수를 초기화한다.</font><br />
<font size=2>이런 초기화 작업을 통해서 다른 방에 입장하게 되면 그 방에 있었던 과거의 대화 내역을 새로 업데이트할 수 있다.</font><br /><br />

<font size=2>7. 내가 작성한 개인 메시지를 서버로 전송하는 함수이다.</font><br />
<font size=2>react-quill을 이용했기 때문에 quill에서 제공하는 getText() 메소드로 글자를 불러올 수 있다.</font><br />
<font size=2>dayjs()를 이용해서 현재 시간을 설정한다.</font><br />
<font size=2>채팅 대화 내역에는 언제 메시지를 작성했는지 시간을 노출하는 부분이 있다.</font><br />
<font size=2>'privateMsg' 이벤트를 이용해서 서버로 메시지 내용을 전송한다.</font><br />
<font size=2>메시지 내용과 함께 누구로부터 어디로 보내야 하는지에 대한 정보도 함께 전송된다.</font><br /><br />

<font size=2>8. 그룹 대화방을 만들기 위해 Direct Messages라는 버튼을 클릭하면 나오는 input 박스이다.</font><br />
<font size=2>input 박스에는 접속한 사용자를 입력하면 자동으로 그룹 대화에 초대할 사용자 리스트를 저장한다.</font><br /><br />

<font size=2>9. 그룹 대화 초대를 위한 input 박스 핸들러이다.</font><br /><br />

<font size=2>10. 초대한 사람의 X 버튼을 클릭하면 실행된다. X를 클릭하면 초대 리스트에서 제거된다.</font><br /><br />

<font size=2>11. 그룹 채팅에서 Join 버튼을 클릭하면 실행된다.</font><br />
<font size=2>Join 버튼을 누르면 'reqGroupJoinRoom'이라는 이벤트를 실행해서 해당하는 사용자에게 초대장이 발송된다.</font><br /><br />

<font size=2>12. 개인 메시지와 동일하게 그룹 메시지를 작성하는 input 박스 핸들러이다.</font><br /><br />

### ChatRoom.style.js (301p)

```
import { css } from "@emotion/react";

export const chatRoomWrapCss = css`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
export const subTitleCss = css`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  font-size: 20px;
  height: 50px;
  font-weight: bold;
  padding: 0 20px;
  border-bottom: 1px solid #cecece;
  .active {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #29ac76;
  }
  .deactive {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    border: 1px solid #cecece;
  }
`;
export const chatBoxGuidCss = css`
  display: flex;
  flex-direction: column;
  padding: 20px;
  justify-content: center;
  align-items: center;
  height: 500px;
  gap; 20px;
  .guide {
    font-weight: bold;
    font-size: 2rem;
  }
`;
export const chatBoxCss = css`
  list-style: none;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 20px;
  flex: 1 1 auto;
  overflow: scroll;
  height: 400px;
  gap: 10px;
`;
export const chatCss = css`
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  .userBox {
    align-items: center;
    display: flex;
    flex-direction: row;
    gap: 5px;
    .user {
      font-weight: bold;
      font-size: 14px;
    }
    .date {
      color: grey;
      font-size: 10px;
    }
  }
  .textBox {
  }
`;
export const textBoxCss = css``;
```

### SideBar.js (303p)

<font size=2>Sidebar 컴포넌트는 채팅할 수 있는 사용자 리스트와 그룹 채팅 리스트를 보여준다.</font><br />
<font size=2>앞에서 만들었던 ChatRoom 컴포넌트와 동일하게 layout 폴더 아래 sideBar 폴더를 추가한다.</font><br />
<font size=2>sideBar 폴더 아래로 SideBar.js와 SideBar.style.js를 만든다.</font><br />

```
import React, { useContext, useEffect } from "react";
import { css } from "@emotion/react";
import { Context }  from "../../../context";
import { CURRENT_CHAT, GROUP_CHAT } from "../../../context/action";
import {
  navBarWrapCss,
  titleCss,
  userListCss,
  directMsgCss,
} from "./SideBar.style";
import { User } from "../../index";
import { socketPrivate, socketGroup, socket } from "../../../socket";

const SideBar = () => {
  // 1
  const {
    state: { userList, loginInfo, currentChat, groupList },
    dispatch,
  } = useContext(Context);

  // 2
  useEffect(() => {
    if( currentChat.targetId.length > 1 ) {
      socketGroup.emit("msgInit", {
        targetId: currentChat.targetId,
      });
    } else {
      socketPrivate.emit("msgInit", {
        targetId: currentChat.targetId,
      });
    }
  }, [currentChat.targetId]);

  // 3
  useEffect(() => {
    function setMsgAlert(data) {
      socketPrivate.emit("resJoinRoom", data.roomNumber);
    }
    socketPrivate.on("msg-alert", setMsgAlert);
    
    return () => {
      socketPrivate.off("msg-alert", setMsgAlert);
    };
  }, []);

  // 4
  useEffect(() => {
    function setGroupChat(data) {
      socketGroup.emit("resGroupJoinRoom", {
        roomNumber: data.roomNumber,
        socketId: data.socketId,
      });
    }

    socketGroup.on("group-chat-req", setGroupChat);

    return () => {
      socketGroup.off("group-chat-req", setGroupChat);
    }
  }, []);

  // 5
  const onUserClickHandler = (e) => {
    const { id } = e.target.dataset;

    dispatch({
      type: CURRENT_CHAT,
      payload: {
        targetId: [id],
        roomNumber: `${loginInfo.userId}-${id}`,
        targetSocketId: e.target.dataset.socket,
      },
    });

    socketPrivate.emit("reqJoinRoom", {
      targetId: id,
      targetSocketId: e.target.dataset.socket,
    });

    dispatch({
      type: GROUP_CHAT,
      payload: {
        textBarStatus: false,
        groupChatNames: [],
      },
    });
  };

  // 6
  const onMakeGroupChat = () => {
    dispatch({
      type: GROUP_CHAT,
      payload: {
        textBarStatus: true,
        groupChatNames: [],
      },
    });
  };

  // 7
  const onGroupUserClickHandler = (e) => {
    const { id } = e.target.dataset;

    dispatch({
      type: CURRENT_CHAT,
      payload: {
        targetId: [...id.split(",")],
        roomNumber: id,
        targetSocketId: e.target.dataset.socket,
      },
    });

    socketGroup.emit("joinGroupRoom", {
      roomNumber: id,
      socketId: e.target.dataset.socket,
    });

    dispatch({
      type: GROUP_CHAT,
      payload: {
        textBarStatus: false,
        groupChatNames: [],
      },
    });
  };

  return (
    <nav css={navBarWrapCss}>
      <div css={titleCss}> Slack</div>
      <ul css={userListCss}>
        <li css={directMsgCss} onClick={onMakeGroupChat}>
          <BiChevronDown size="20" /> Direct Messages +
        </li>
        {userList.map((v, i) => (
          <li key={`${i}-user`}>
            <User
              id={v.userId}
              status={v.status}
              socket={v.socketId}
              type={v.type}
              onClick={
                v.type === "group"
                  ? onGroupUserClickHandler
                  : onUserClickHandler
              }
            />
          </li>
        ))}
        {groupList.map((v, i) => (
          <li key={`${i}-user`}>
            <User
              id={v.userId}
              status={v.status}
              socket={v.socketId}
              type={v.type}
              onClick={
                v.type === "group"
                  ? onGroupUserClickHandler
                  : onUserClickHandler
              }
            />
          </li>
        ))}
      </ul>
    </nav>
  )
};

export default SideBar;
```

<font size=2>1. 사이드바에 필요한 사용자 리스트와 그룹 리스트를 가져온다.</font><br /><br />

<font size=2>2. 현재 클릭한 userId를 'msgInit'이라는 이벤트에 보낸다.</font><br />
<font size=2>if 문의 targetId.length 값이 1보다 크면 그룹 채팅을 의미한다.</font><br />
<font size=2>그룹 채팅일 경우 socketGroup 네임스페이스 객체를 이용하고 개인 채팅이라면 socketPrivate 객체를 이용한다.</font><br /><br />

<font size=2>3. 개인 채팅의 초대를 받으면 실행된다.</font><br />
<font size=2>만약 A라는 사람이 먼저 B와 개인 대화를 시작하면 B는 'msg-alert'라는 이벤트를 이용해서 A의 초대 방 번호를 받는다.</font><br />
<font size=2>A는 'resJoinRoom'이라는 이벤트로 해당 방 번호를 서버로 전송해서 스스로 방에 입장한다.</font><br /><br />

<font size=2>4. 위의 개인 채팅과 동일하게 그룹 채팅에 입장하는 로직이다.</font><br />
<font size=2>특정한 그룹방에 초대받으면 'group-chat-req'라는 이벤트로 방 번호를 전달받는다.</font><br />
<font size=2>'resGroupJoinRoom'이라는 이벤트로 자신을 해당 방에 입장시킨다.</font><br /><br />

<font size=2>5. 사이드바에 노출된 개인을 클릭하면 실행된다.</font><br />
<font size=2>CURRENT_CHAT이라는 액션 값을 이용해서 현재 자신이 대화하고 있는 방에 정보를 전역 변수에 저장한다.</font><br />
<font size=2>대화하고 싶은 상대에게 초대장을 보내고 초대장에는 통신하는 상대의 소켓 아이디가 포함되어 있다.</font><br /><br />

<font size=2>6. 사이드바에 있는 Direct Messages를 클릭하면 실행된다.</font><br />
<font size=2>클릭 이후 그룹 대화를 만들 수 있는 input 박스가 활성화된다.</font><br />
<font size=2>해당 변수는 물론 전역 변수로 관리된다.</font><br /><br />

<font size=2>7. 개인 채팅과 동일하게 그룹 채팅을 클릭하면 실행되는 함수이다.</font><br />
<font size=2>개인 채팅과는 다르게 그룹 채팅이다 보니 대화하는 상대를 ','로 구분지어 문자열로 관리한다.</font><br />
<font size=2>그룹 채팅의 방 번호는 ','를 이용한 문자열로 관리되기 때문에 서버에서 해당 문자를 ','로 잘라서 배열로 관리한다.</font><br />
<font size=2>하나씩 순회하면서 그룹 채팅 참가자들에게 초대장을 전송한다.</font><br /><br />

### SideBar.style.js (310p)

```
import { css } from "@emotion/react";

export const navBarWrapCss = css`
  height: 100%;
  width: 250px;
  display: flex;
  flex-direction: column;
  background-color: #4a154b;
`;
export const titleCss = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #fff;
  font-weight: bold;
  padding: 0 20px;
  height: 50px;
  border-bottom: 1px solid rgba(234, 234, 234, 0.2);
`;
export const directMsgCss = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #cecece;
  font-size: 14px;
  padding: 7px 20px 7px 14px;
  cursor: pointer;
  &: hover {
    background-color: rgba(234, 234, 234, 0.2);
  }
`;
export const userListCss = css`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;
```

<font size=2>끝으로 작성한 컴포넌트를 쉽게 불러올 수 있도록 componentsㅍ 폴더에 index.js를 작성한다.</font><br />

```
export { default as SideBar } from "./layout/sideBar/SideBar";
export { default as User } from "./user/User";
export { default as ChatRoom } from "./layout/chatRoom/ChatRoom";
export { default as TextEditor } from "./textEditor/TextEditor";
export { default as GroupTextInput } from "./groupTextInput/GroupTextInput";
```

### App.js (311p)

<font size=2>마지막으로 App.js에 라우팅을 설정한다.</font><br />
<font size=2>라우팅은 단순하게 로그인 페이지와 채팅을 하는 메인 페이지이다.</font><br />

```
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { IndexContainer, MainContainer } from "./containers";
import { StoreProvider } from "./context";

const App = () => {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route path="/" element={<IndexContainer />}/>
          <Route path="/main" element={<MainContainer />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
}

export default App;
```