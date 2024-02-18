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

<font size=2>또 서버를 시작하기 위해 package.json에 아래 스크립트를 추가하겠다.</font><br />

```
"start": "nodemon server.js",
```

### Schema.js (217p)

<font size=2>google-docs 프로젝트에서는 사용자가 입력한 정보를 저장하기 위해 mongoDB를 사용한다.</font><br />
<font size=2>mongoDB는 데이터베이스이기 때문에 스키마 정보를 필요로 한다.</font><br />

```
스키마란?

데이터베이스의 스키마(schema)는 데이터의 자료구조와 연관관계 등을 기술한 메타데이터이다.
그래서 스키마를 통해 사람들은 애플리케이션의 데이터 관계를 파악하고 제약조건을 빠르게 이해할 수 있다.
스키마는 개체(entity), 속성(attribute), 관계(relation) 등으로 이루어져 있다.
```

<font size=2>먼저 server 폴더에 Schema.js 파일을 만들어준다.</font><br />
<font size=2>우리가 만들 스키마 내용을 추가한다.</font><br />

```
const { Schema, model } = require("mongoose");

const googleDocsSchema = new Schema({
    _id: String,
    data: Object,
});

module.exports = model("GoogleDocs", googleDocsSchema);
```

<font size=2>mongoose에는 Schema와 model 이라는 함수를 이용해서 간단하게 스키마를 만들고 모델화할 수 있다.</font><br />
<font size=2>_id와 data 이름을 갖는 도큐먼트를 만든다.</font><br />
<font size=2>_id는 문자열 속성을 가지고 data는 객체의 속성을 가진다.</font><br />

### server.js (218p)

<font size=2>이제는 server.js를 작성하겠다.</font><br />
<font size=2>server.js는 socket.io를 이용해서 만든 소켓 서버이다.</font><br />
<font size=2>또한 mongoDB를 연결하는 작업도 포함한다.</font><br />

```
// 1
const mongoose = require("mongoose");
const Document = require("./Schema");

const uri = "mongodb+srv://google-docs:1111@cluster0.6suahnm.mongodb.net/?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
mongoose
  .connect(uri)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// 2
const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const userMap = new Map();

io.on("connection", (socket) => {
  let _documentId = "";

  // 3
  socket.on("join", async (documentId) => {
    _documentId = documentId;
    const document = await findOrCreateDocument(documentId);

    socket.join(documentId);
    socket.emit("initDocument", {
      _document: document.data,
      userList: userMap.get(documentId) || [],
    });

    const myId = Array.from(socket.rooms)[0];
    setUserMap(_documentId, myId);
    socket.broadcast.to(_documentId).emit("newUser", myId);
  });

  // 4
  socket.on("save-document", async (data) => {
    await Document.findByIdAndUpdate(_documentId, { data });
  });

  // 5
  socket.on("send-changes", (delta) => {
    socket.broadcast.to(_documentId).emit("receive-changes", delta);
  });

  // 6
  socket.on("cursor-changes", (range) => {
    const myRooms = Array.from(socket.rooms);
    
    socket.broadcast.to(_documentId).emit("receive-cursor", { range: range, id: myRooms[0] });
  });

  socket.on("disconnect", () => {
    console.log("disconnect...");
  });
});

// 7
function setUserMap(documentId, myId) {
  const tempUserList = userMap.get(documentId);

  if( !tempUserList ) {
    userMap.set(documentId, [myId]);
  } else {
    userMap.set(documentId, [...tempUserList, myId]);
  }
};

// 8
async function findOrCreateDocument(id) {
  if( id === null ) return;

  const document = await Document.findById(id);

  if( document ) return document;

  return await Document.create({ _id: id, data: defaultValue });
};
```

<font size=2>1. mongoose 라이브러리와 미리 작성한 Schema.js 파일을 불러온다.</font><br />
<font size=2>또한 부록에서 설정한 mongoDB 연결 정보를 uri에 복사/붙여넣기 했다.</font><br />
<font size=2>mongoose에서는 strictQuery가 true로 설정되어 있다.</font><br />
<font size=2>false로 변경한다면 mongoDB에 유연하게 접근할 수 있다.</font><br />
<font size=2>그러나 보안의 이유로 실제 운영하는 서비스라면 true를 추천한다.</font><br />
<font size=2>connect(uri) 함수를 이용해서 우리가 미리 설정한 mongoDB에 접속할 수 있다.</font><br />

```
mongoose.connect(uri)

uri 정보에는 아이디와 비밀번호가 노출된다.
실제 운영 환경에서는 소스에 직접 입력하기보다는 환경변수와 같은 다른 방법을 추천한다.
```

<font size=2>2. socket.io를 이용해서 소켓 서버를 생성한다.</font><br />
<font size=2>우리가 만든 소켓 서버는 5000번 포트를 가지며 http://localhost:3000에서 오는 요청을 허용한다.</font><br />
<font size=2>접속한 사용자의 정보를 userMap이라는 객체에 저장할 예정이다.</font><br />
<font size=2>사용자의 정보는 Map 형태로 저장되며 키 값으로는 도큐먼트 아이디, 값으로는 접속한 사용자의 아이디를 배열 형태로 저장한다.</font><br /><br />

<font size=2>3. 최초 사용자가 google-docs에 진입하면 'join'이라는 소켓 이벤트를 호출하게 된다.</font><br />
<font size=2>'join' 이벤트는 기본적으로 documentId라는 변수를 함께 넘기게 되어있다.</font><br />
<font size=2>findOrCreateDocument()는 클라이언트에서 전달받은 documentId를 이용해서 기존에 작성한 문서가 있는지 확인하고</font><br />
<font size=2>있다면 기존 문서를 반환하고 없다면 비어 있는 문서를 반환하는 함수이다.</font><br />
<font size=2>각 문서마다 정보를 다르게 관리하기 위해 socket.join()을 이용해서 documentId에 맞는 방을 생성했다.</font><br />
<font size=2>'initDocument' 이벤트를 이용해서 접속한 사용자에게 현재 문서의 내용과 접속되어 있는 사용자 정보를 전송한다.</font><br />
<font size=2>전송된 사용자 정보는 실시간으로 다른 사람의 커서 정보를 확인할 수 있는 기본 데이터가 된다.</font><br />
<font size=2>socket.rooms를 이용해서 socket.io가 제공하는 기본적인 socket ID(사용자 아이디)를 확인할 수 있다.</font><br />
<font size=2>setUserMap()으로 현재 아이디 값을 Map에 저장하고 나를 제외한 같은 방에 속해 있는 모든 사람에게 나의 socket ID를 전송한다.</font><br /><br />

<font size=2>4. 'save-document' 이벤트를 이용해서 현재 작성 중인 글을 저장한다.</font><br />
<font size=2>findByIdAndUpdate()는 mongoose에서 제공되는 함수로 데이터를 업데이트하는데 사용한다.</font><br /><br />

<font size=2>5. 'send-changes' 이벤트는 클라이언트에서 작성되는 글을 실시간으로 전송받아서 다른 사용자에게 전송하는 역할을 한다.</font><br />
<font size=2>여기서 중요한 것은 'delta'라는 객체이다.</font><br />
<font size=2>'delta'는 우리가 사용하는 quill이라는 에디터에서 사용하는 객체이다.</font><br />
<font size=2>delta를 사용하면 quill 문서의 내용과 변화 등 다양한 부분을 표현할 수 있다.</font><br /><br />

<font size=2>6. 'cursor-changes' 이벤트는 실시간으로 다른 사용자의 커서 클릭을 감지한다.</font><br />
<font size=2>만약 나의 커서가 클릭을 했다면 라를 제외한 모든 사람들에게 커서의 위치 정보와 나의 사용자 아이디가 전송된다.</font><br /><br />

<font size=2>7. setUserMap()은 우리가 위에서 작성한 userMap 객체를 관리하는 함수이다.</font><br />
<font size=2>기본적으로 자바스크립트의 Map은 set(), get() 메소드를 이용해서 데이터를 추가하고 가져와서 사용할 수 있다.</font><br /><br />

<font size=2>8. findOrCreateDocument()는 mongoDB에 접근해서 문서의 유무를 확인한다.</font><br />
<font size=2>기존에 문서가 없다면 create() 메소드를 이용해서 생성한다.</font><br /><br />

### 클라이언트 사이드 (223p)

```
필요한 라이브러리

 • @emotion/react
  - emotionjs는 CSS 스타일을 위한 라이브러리이다.
  - emotionjs를 이용해서 module.css와 scss 같은 기능을 간편하게 사용할 수 있다.

 • lodash-es
  - lodash는 자바스크립트의 대표적인 utility 기능을 모아놓은 라이브러리이다.
  - 함수형 프로그래밍으로 되어 있기 때문에 가독성 좋은 코딩이 가능하다.

 • quill-cursors
  - quill 에디터의 멀티 커서 기능을 사용하기 위해 추가했다.

 • react-quill
  - quill은 대표적인 자바스크립트 에디터 라이브러리이다.
  - quill을 이용하면 우리가 흔히 사용하는 블로그와 문서 형식의 웹 서비스를 간편하게 제작할 수 있다.
  - 여기서는 리액트 지원 버전인 react-quill을 사용할 예정이다.

 • react-router-dom
  - 리액트 라우팅을 위해 사용한다.

 • socket.io-client
  - 브라우저의 소켓 통신을 위해 사용한다.

 • uuid
  - UUID는 Universally Uique IDentifier의 약자로 네트워크에서 고유한 아이디 값을 표현하는 규약이다.
  - 흔히 UUID를 생성한다고 하면 고유의 키 값이 필요할 때 사용한다.
  - 작성 중인 문서를 구분하기 위한 키 값으로 사용할 예정이다.

 • @craco/craco
  - CRACO는 Create-React-App Configuration Override의 약자로 우리가 사용하는 CRA를 쉽게 설정할 수 있는 기능을 제공한다. 

CRACO를 꼭 사용해서 설정해야 하나?

CRA로 리액트 프로젝트를 시작한 경우 꼭 CRACO를 이용해서 설정 파일을 건드리지 않아도 된다.
다만 CRACO를 이용하지 않는다면 CRA에서 제공하는 eject라는 명령어를 이용해서 실행해야 한다.

eject 명령어는 CRA 프로젝트가 설정해놓은 모든 파일을 공개적으로 프로젝트 폴더에 노출하게 하는 명령어이다.
여기서 말하는 설정 파일은 웹팩과 바벨 같은 설정을 말한다.

그러나 eject를 실행한 CRA 프로젝트는 다시 전 상태로 돌릴 수 없으며 CRA에서 관리되는 리액트 버전을 관리하는 데 번거로움이 있다.
특히 프로젝트 디렉터리가 어지럽게 변하는 단점이 있다.

 • @emotion/babel-preset-css-prop
  - emotionjs를 사용하기 위한 바벨 설정 파일이다.
```

<font size=2>클라이언트를 위한 라이브러리를 먼저 설치하겠다.</font><br />

```
 > npm i @emotion/react
 > npm i lodash-es
 > npm i quill-cursors
 > npm i react-router-dom
 > npm i socket.io-client
 > npm i uuid
 > npm i --save-dev @craco/craco
 > npm i --save-dev @emotion/babel-preset-css-prop
```

<font size=2>설치하는 과정에서 --save-dev라는 설정값이 추가되었다.</font><br />
<font size=2>--save-dev 명령어로 설치된 라이브러리는 package.json의 'devDependencies'로 관리된다.</font><br />
<font size=2>또한 production으로 배포될 때는 빌드되는 파일에는 포함되지 않는 특징을 가지고 있다.</font><br /><br />

<font size=2>스타일 라이브러리인 emotionjs를 CRA에서 사용하기 위한 CRACO 라이브러리 설정이 필요하다.</font><br />
<font size=2>루트 디렉터리인 client에서 craco.config.js 파일을 생성하고 아래 코드를 작성한다.</font><br />

```
module.exports = {
  babel: {
    presets: ['@emotion/babel-preset-css-prop'],
  },
}
```

<font size=2>이제 클라이언트 프로젝트를 위한 모든 준비는 끝났다.</font><br />
<font size=2>컴포넌트부터 하나씩 작성을 시작하겠다.</font><br />

### socket.js (227p)

<font size=2>소켓을 연결하기 위한 socket.js 파일을 추가한다.</font><br />
<font size=2>socket.js 파일은 웹 소켓을 연결하기 위한 socket.io 객체를 초기화한다.</font><br />

```
import { io } from "socket.io-client";

export const socket = io("http://localhost:5000");
```

### TextEditor.js (227p)

<font size=2>먼저 src 아래 components라는 폴더를 생성하고 그 아래에 textEditor라는 폴더를 만든다.</font><br />
<font size=2>TextEditor.js와 textEditor.style.js 파일을 textEditor 폴더 아래에 생성한다.</font><br />

```
// 1
import { css } from "@emotion/react";
import QuillCursors from "quill-cursors";
import { containr } from "./textEditor.style";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

// 2
const modules = {
  cursors: true,
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
  ],
};

Quill.register("module/cursors", QuillCursors);

// 3
const TextEditor = ({
  text,
  onChangeTextHandler,
  reactQuillRef,
  onChangeSelection,
}) => {
  return (
    <div css={container}>
      <ReactQuill
        theme="snow"
        modules={modules}
        value={text}
        onChange={onChangeTextHandler}
        onChangeSelection={onChangeSelection}
        ref={(el) => {
          reactQuillRef.current = el;
        }}
      />
    </div>
  );
};

export default TextEditor;
```

<font size=2>1. 우리가 사용할 emotionjs와 ReactQuill을 추가한다.</font><br />
<font size=2>또한 Quill 테마 중에 snow라는 CSS 스타일을 가져와서 quill 스타일을 적용한다.</font><br />
<font size=2>quill-cursors를 이용해서 다중 사용자의 커서 위치를 확인할 수 있다.</font><br />
<font size=2>emotionjs에서는 'css'라는 속성을 이용해서 CSS 스타일을 정의한다.</font><br /><br />

<font size=2>2. Quill 라이브러리에서는 객체 구조를 이용해서 에디터의 다양한 도구를 구현하고 사용할 수 있다.</font><br />
<font size=2>modules라는 객체 안에 toolbar 배열을 확인하면 우리가 흔히 볼 수 있는 에디터의 편집 도구를 확인할 수 있다.</font><br />
<font size=2>Quill 라이브러리에는 다양한 모듈을 추가할 수 있다.</font><br />
<font size=2>제공되는 기본적인 모듈의 사용부터 사용자가 직접 제작할 수 있는 커스텀 모듈까지 에디터를 추가할 수 있다.</font><br /><br />

<font size=2>3. TextEditor라는 재사용 가능한 컴포넌트를 정의했다.</font><br />
<font size=2>TextEditor는 속성으로 작성된 글 정보와 onChange, onChangeSelection이라는 이벤트 함수를 받는다.</font><br />
<font size=2>마지막으로 Quill 정보를 부모 컴포넌트에서 참조하기 위해 리액트의 ref 속성을 이용했다.</font><br />

```
// 1
import { css } from "@emotion/react";

export const container = css`
  .quill {
    height: 100vh;
    padding: 20px;
    margin: 20px;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
    background-color: #fff;
  }
  .ql-container.ql-snow {
    border: none;
    display: flex;
    justify-content: center;
  }
  .ql-container.ql-editor {
    width: 100%;
  }
  .ql-toolbar.ql-snow {
    display: flex;
    justify-content: center;
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: #f3f3f3;
    border: none;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  }
`;
```

<font size=2>1. emotionjs를 이용해서 우리가 사용할 CSS 스타일을 정의한다.</font><br />
<font size=2>특이한 점은 파일명이 css가 아니라 js로 되어 있다는 점이다.</font><br />
<font size=2>emotionjs를 대표적인 CSS-in-JS 라이브러리이다.</font><br />
<font size=2>그래서 js파일 형태처럼 작성되고 js처럼 export, import가 가능하다.</font><br />
<font size=2>CSS-in-JS이기 때문에 TextEditor.js 파일에 동시에 작성할 수 있다.</font><br />
<font size=2>그러나 스타일을 분리해서 작성하면 프로젝트 파일 관리와 가독성이 뛰어난 장점이 있다.</font><br />

### EditorContainer.js (231p)

<font size=2>TextEditor 컴포넌트를 불러와서 사용하는 컨테이너를 정의하겠다.</font><br />
<font size=2>src 아래 containers 폴더를 추가하고 그 아래에 editorContainer 폴더를 만든다.</font><br />
<font size=2>editorContainer 폴더 아래 EditorContainer.js 파일을 추가한다.</font><br />
<font size=2>EditorContainer.js는 소켓 통신과 Quill 이벤트를 관장하는 역할을 한다.</font><br />

```
import React, { useEffect, useRef, useState } from "react";
// 1
import { useParams } from "react-router-dom";
import { debounce } from "lodash-es";
import TextEditor from "../../components/textEditor";
import { socket } from "../../socket";

// 2
const cursorMap = new Map();
const cursorColor = [
  "#ff0000",
  "#ff5e00",
  "#ffbb00",
  "#ffe400",
  "#abf200",
  "#1ddb16",
  "#00d8ff",
  "#0054ff",
];

const EditorContainer = () => {
  const timerRef = useRef(null);
  const cursorRef = useRef(null);
  const reactQuillRef = useRef(null);
  // 3
  const { id: documentId } = useParams();
  const [ text, setText ] = useState("");

  // 4
  useEffect(() => {
    socket.emit("join", documentId);

    return () => {
      socket.disconnect();
    };
  }, []);

  // 5
  useEffect(() => {
    socket.once("initDocument", (res) => {
      const { _document, userList } = res;
      
      setText(_document);
      userList.forEach((u) => {
        setCursor(user);
      });
    });
  }, []);

  // 6
  useEffect(() => {
    function setCursorHandler(user) {
      setCursor(user);
    };

    socket.on("newUser", setCursorHandler);

    return () => {
      socket.off("newUser", setCursorHandler);
    }
  }, []);

  // 7
  useEffect(() => {
    if(!reactQuillRef.current) return;

    cursorRef.current = reactQuillRef.current.getEditor().getModule("cursors");
  }, []);

  // 8
  useEffect(() => {
    function updateContentHandler(delta) {
      reactQuillRef.current.getEditor().updateContents(delta);
    }

    socket.on("receive-changes", updateContentHandler);

    return () => {
      socket.off("receive-changes", updateContentHandler);
    };
  }, []);

  // 9
  useEffect(() => {
    function updateHandler(res) {
      const { range, id } = res;
      debouncedUpdate(range, id);
    }

    socket.on("receive-cursor", updateHandler);

    return () => {
      socket.off("receive-cursor", updateHandler);
    };
  }, []);

  // 10
  const onChangeTextHandler = (content, delta, source, editor) => {
    if( timerRef.current !== null ) {
      clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        socket.emit(
          "save-document",
          reactQuillRef.current.getEditor().getContents()
        );

        timerRef.current = null;
      }, 1000);

      if( source !== "user" ) return;

      socket.emit("send-changes", delta);
    }
  };

  // 11
  function setCursor(id) {
    if( !cursorMap.get(id) ) {
      cursorRef.current.createCursor(
        id,
        id,
        cursorColor[Math.floor(Math.random() * 8)]
      );

      cursorMap.set(id, cursorRef.current);
    }
  };

  // 12
  const debouncedUpdate = debounce((range, id) => {
    cursorMap.get(id).moveCursor(id, range);
  }, 500);

  // 13
  const onChangeSelection = (selection, source, editor) => {
    if( source !== "user" ) return;

    socket.emit("cursor-changes", selection);
  };

  return (
    <TextEditor 
      text={text}
      onChangeTextHandler={onChangeTextHandler}
      onChangeSelection={onChangeSelection}
      reactQuillRef={reactQuillRef}
    />
  );
};

export default EditorContainer;
```

<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />