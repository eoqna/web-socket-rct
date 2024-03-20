## 슬랙 메신저 (241p)

<font size=2>이번에 만들어볼 예제는 슬랙(Slack) 메신저이다.</font><br />
<font size=2>전 세계적으로 유명한 메신저를 선택하라고 한다면 그중 하나가 바로 슬랙이다.</font><br />
<font size=2>슬랙은 특시 비즈니스 환경에 강점을 가지고 있다.</font><br /><br />

<font size=2>개인 채팅과 그룹 채팅은 물론 다양한 API 연동이 가능하다.</font><br />
<font size=2>특히 개발자들에게는 깃허브, 깃랩과 같은 버전 관리 툴을 연동해서 소스 커밋 내용과 알림 등을 실시간으로 확인할 수 있다는 장점을 가지고 있다.</font><br />
<font size=2>최근에는 chatGPT를 슬랙에서 간편하게 사용할 수 있는 기능도 추가되었다.</font><br /><br />

<font size=2>지금부터 앞에서 배웠던 내용을 토대로 슬랙의 가장 기본적인 기능인 개인 메시지와 그룹 메시지를 만들어보겠다.</font><br />
<font size=2>먼저 슬랙에 접속할 수 있는 아이디를 설정하는 부분을 구현한다.</font><br />
<font size=2>여기에 특정한 아이디를 설정해 로그인할 수 있다.</font><br /><br />

<font size=2>다음 화면은 개인 메시지를 주고받을 수 있는 화면이다.</font><br />
<font size=2>오른쪽에는 현재 접속한 사람의 리스트가 출력된다.</font><br />
<font size=2>초록색이 회색으로 변경된다면 해당 사용자는 로그아웃한 것으로 간주한다.</font><br /><br />

<font size=2>그리고 그룹 채팅도 구현한다.</font><br />
<font size=2>그룹 채팅으로 현재 소속되어 있는 모든 사용자에게 방을 임의로 생성하고 초대할 수 있다.</font><br />

### 프로젝트 초기 설정 (243p)

<font size=2>먼저 slack 프로젝트 폴더를 생성한다.</font><br />
<font size=2>그 아래에 server와 client 폴더를 생성한다. client 폴더 생성은 CRA를 이용한다.</font><br />

```
> mkdir slack
> cd slack
> mkdir server
> npx create-react-app client
```

<font size=2>다음으로 server 폴더로 이동해서 npm 프로젝트를 설정하고 server.js 파일을 생성한다.</font><br />

```
> cd server
> npm init
```

<font size=2>slack 프로젝트에서 사용할 images 폴더도 생성한다.</font><br />

```
> cd client/src
> mkdir images
```

```
이미지 파일 확인하기

프로젝트에 사용되는 파일은 깃허브 주소를 참고하면 된다.

https://github.com/devh-e/socket-programming-using-react/tree/master/part2/slack/client/src/images
```

<font size=2>깃허브에서 다운로드한 이미지 파일을 images 폴더에 넣는다.</font><br />
<font size=2>마지막으로 client 폴더에서 사용하지 않는 파일을 삭제하겠다.</font><br />

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

### 서버 사이드 (246p)

```
필요한 라이브러리

 • mongoose : mongoDB를 사용하기 위한 인터페이스 기능을 제공한다.
 • nodemon : nodejs 서버를 모니터링하고 쉽게 재시작하기 위해 사용한다.
 • socket.io : 소켓 통신을 위해 사용한다.
```

<font size=2>서버 사이드에 필요한 라이브러리를 설치한다.</font><br />

```
> npm install mongoose
> npm install nodemon
> npm install socket.io
```

<font size=2>또 서버를 시작하기 위해 package.json에 아래 스크립트를 추가한다.</font><br />

```
 "start": "nodemon server.js",
```

### server.js (247p)

<font size=2>서버의 루트에 해당하는 server.js를 생성한다.</font><br />
<font size=2>server.js 아래로 1:1 메시지를 담당하는 privateMsg.js와 그룹 메시지인 groupMsg.js, 마지막으로 공통 로직을 처리하는 common.js를 생성한다.</font><br />
<font size=2>각각의 기능들은 위에서 학습했던 socket.io의 네임스페이스를 사용한다.</font><br />

```
server.js

// 1
const privateMsg = require("./privateMsg");
const groupMsg = require("./groupMsg");
const common = require("./common");
const mongoose = require("mongoose");

// 2
const uri = "Mongo DB URI";
mongoose.set("strictQuery", false);
mongoose
  .connect(uri)
  .then(() => console.log("MongDB Connected..."))
  .catch((err) => console.log(err));

// 3
const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// 4
common.commoninit(io);
groupMsg.groupMsginit(io);
privateMsg.privateMsginit(io);
```

<font size=2>1. 앞에서 미리 설명한 각각의 네임스페이스에 해당하는 로직을 불러왔다.</font><br />
<font size=2>추가적으로 mongoDB와 연결하기 위한 mongoose 라이브러리도 포함했다.</font><br /><br />

<font size=2>2. mongoDB를 연결하기 위한 설정이다.</font><br />
<font size=2>이 책 부록에 있는 mongoDB 환경 설정 부분을 참고해라.</font><br />

```
 uri 정보에는 아이디와 비밀번호가 노출된다.
 실제 운영 환경에서는 소스에 직접 입력하기보다는 환경변수와 같은 다른 방법을 추천한다.
```

<font size=2>3. socket.io를 이용해서 소켓 서버를 생성한다. 포트는 5000번이다.</font><br /><br />

<font size=2>4. 우리가 불러온 각각의 로직을 실행하는 메소드이다.</font><br />
<font size=2>각각의 메소드는 socket.io 객체를 받는다.</font><br /><br />

### common.js (249p)

<font size=2>common.js는 공통적인 로직을 수행한다.</font><br />
<font size=2>사용자가 처음 슬랙 메신저에 접속했을 때 사용자 등록과 기존에 등록된 사용자 리스트를 클라이언트로 전송한다.</font><br />
<font size=2>먼저 server 폴더 아래 common.js 파일을 생성하고 아래의 코드를 작성해준다.</font><br />

```
// 1
const User = require("./schema/User");
const common = (io) => {
  io.use(async (socket, next) => {
    const userId = socket.handshake.auth.userId;

    if( !userId ) {
      console.log("err");
      return next(new Error("invalid userId"));
    } 

    socket.userId = userId;
    await findOrCreateUser(socket.userId, socket.id);
    next();
  });

  io.on("connection", async (socket) => {
    io.sockets.emit("user-list", await User.find());

    socket.on("disconnect", async () => {
      await User.findOneAndUpdate(
        { _id: socket.userId },
        { status: false }
      );

      io.sockets.emit("user-list", await User.find());
      console.log("disconnect...");
    });
  });
};

async function findOrCreateUser(userId, socketId) {
  if( userId === null ) return;

  const document = await User.findOneAndUpdate(
    { _id: userId },
    { status: true }
  );

  if( document ) return document;
    
  return await User.create({
    _id: userId,
    status: true,
    userId: userId,
    socketId: socketId,
  });
}

module.exports.commoninit = common;
```

<font size=2>1. User 테이블의 스키마 내용을 불러온다. 지금은 정의되지 않는 오류가 날 수 있다.</font><br /><br />

<font size=2>2. 미들웨어를 이용해서 접속한 소켓의 초기 설정을 담당한다.</font><br />
<font size=2>클라이언트에서 받은 userId를 해당 소켓에 등록한다.</font><br />
<font size=2>만약 넘어온 userId가 없다면 오류를 반환한다.</font><br />
<font size=2>해당 함수를 이용해서 mongoDB에 사용자를 등록한다.</font><br /><br />

<font size=2>3. 소켓이 연결되면 mongoDB에 등록되어 있는 사용자 리스트를 클라이언트로 전송한다.</font><br />
<font size=2>User.find() 함수는 mongoose에서 제공하는 함수로 등록되어 있는 모든 데이터를 가져오는 역할을 한다.</font><br />
<font size=2>소켓 연결이 끊겼을 때 findOneAndUpdate 메소드를 이용해서 사용자의 접속 상태를 false로 변경한다.</font><br /><br />

<font size=2>4. findOrCreateUser()는 사용자를 등록하는 함수이다.</font><br />
<font size=2>실행 전에 먼저 User 테이블에 정보가 있는지 확인한 후에 있다면 접속 상태를 true로 변환한다.</font><br />
<font size=2>기존에 데이터가 없다면 User 스키마에 맞게 신규 데이터를 등록한다.</font><br /><br />

### privateMsg.js (252p)

<font size=2>privateMsg는 1:1 채팅을 담당한다.</font><br />
<font size=2>common.js와 동일하게 server 폴더 아래에 privateMsg.js 파일을 생성한다.</font><br />

```
// 1
const { PrivateRoom, PrivateMsg } = require("./schema/Private");

const privateMsg = (io) => {
  // 2
  io.of("/private").use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      console.log("err");
      return next(new Error("invalid userId"));
    }
    socket.userId = userId;
    next();
  });

  io.of("/private").on("connection", (socket) => {
    // 3
    socket.on("msgInit", async (res) => {
      const { targetId } = res;
      const userId = targetId[0];
      const privateRoom = await getRoomNumber(userId, socket.userId);
      if (!privateRoom) return;
      const msgList = await PrivateMsg.find({ roomNumber: privateRoom._id }).exec();
      io.of("/private").to(privateRoom._id).emit("private-msg-init", { msg: msgList });
    });
    // 4
    socket.on("privateMsg", async (res) => {
      const { msg, toUserId, time } = res;
      const privateRoom = await getRoomNumber(toUserId, socket.userId);
      if (!privateRoom) return;
      socket.broadcast.in(privateRoom._id).emit("private-msg", {
        msg: msg,
        toUserId: toUserId,
        fromUserId: socket.userId,
        time: time,
      });
      await createMsgDocument(privateRoom._id, res);
    });
    // 5
    socket.on("reqJoinRoom", async (res) => {
      const { targetId, targetSocketId } = res;
      let privateRoom = await getRoomNumber(targetId, socket.userId);
      if (!privateRoom) {
        privateRoom = `${targetId}-${socket.userId}`;
        await findOrCreateRoomDocument(privateRoom);
      } else {
        privateRoom = privateRoom._id;
      }
      socket.join(privateRoom);
      io.of("/private")
        .to(targetSocketId)
        .emit("msg-alert", { roomNumber: privateRoom });
    });
    // 6
    socket.on("resJoinRoom", (res) => {
      socket.join(res);
    });
  });
};

// 7
async function getRoomNumber(fromId, toId) {
  return (
    (await PrivateRoom.findById(`${fromId}-${toId}`)) ||
    (await PrivateRoom.findById(`${toId}-${fromId}`))
  );
}

// 8
async function findOrCreateRoomDocument(room) {
  if (room == null) return;

  const document = await PrivateRoom.findById(room);
  if (document) return document;
  return await PrivateRoom.create({
    _id: room,
  });
}

// 9
async function createMsgDocument(roomNumber, res) {
  if (roomNumber == null) return;

  return await PrivateMsg.create({
    roomNumber: roomNumber,
    msg: res.msg,
    toUserId: res.toUserId,
    fromUserId: res.fromUserId,
    time: res.time,
  });
}

module.exports.privateMsginit = privateMsg;
```

<font size=2>1. private 스키마의 두 기능인 방 생성과 채팅을 불러온다.</font><br />
<font size=2>스키마 구조에 대한 이야기는 뒤에서 자세히 설명하겠다.</font><br /><br />

<font size=2>2. 미들웨어를 이용해서 접속한 사용자의 아이디를 등록한다.</font><br /><br />

<font size=2>3. 1:1 채팅방에 들어가면 실행되는 'msgInit' 이벤트이다.</font><br />
<font size=2>'msgInit' 이벤트의 주요 기능은 과거의 채팅이력을 가져오는 역할을 한다.</font><br />
<font size=2>클라이언트에서 보내온 userId와 소켓에 등록된 사용자 아이디를 이용해서 기존에 1:1로 등록된 방이 있는지 검색한다.</font><br />
<font size=2>기존 대화한 방이 있다면 find() 함수를 이용해서 대화 내역을 가져온다.</font><br />
<font size=2>그 대화 내역을 'private-msg-init' 이벤트를 이용해서 클라이언트에게 전송한다.</font><br /><br />

<font size=2>4. 'privateMsg'는 1:1 메시지를 전송하는 이벤트이다.</font><br />
<font size=2>방이 있다면 broadcast.in() 메소드를 이용해서 해당 방에 있는 사용자에게 메시지를 전송한다.</font><br />
<font size=2>추가적으로 createMsgDocument()는 메시지를 mongoDB에 저장하는 역할을 한다.</font><br /><br />

<font size=2>5. 'reqJoinRoom' 이벤트는 1:1 대화방에 자신을 포함시키는 것은 물론 상대방에게 들어오라는 메시지를 전송한다.</font><br />
<font size=2>물론 해당 로직은 다른 사용자가 모르게 소켓 로직에 의해서만 진행한다.</font><br />
<font size=2>생성된 방이 없다면 새로 생성하고 있다면 기존 방에 입장한다.</font><br />
<font size=2>방에 들어가는 건 socket.io의 join() 함수를 사용한다.</font><br />
<font size=2>해당 방에 들어오라는 초대장을 'msg-alert'라는 이벤트를 이용해서 상대방에게 전송한다.</font><br />
<font size=2>전송 내용에는 방 번호가 함께 전송된다.</font><br /><br />

<font size=2>6. 만약 초대를 받은 상대방이라면 'resJoinRoom' 이라는 이벤트가 자동으로 호출된다.</font><br />
<font size=2>자신도 모르는 사이에 해당 방에 들어가게 된다.</font><br /><br />

<font size=2>7. getRoomNumber() 함수는 mongoDB에 등록되어 있는 방을 검색하는 역할을 한다.</font><br />
<font size=2>여기서 의아한 건 1:1 사용자의 아이디를 뒤집어서 한 번 더 검색하는 것이다.</font><br />
<font size=2>만약 Kyle과 Tom이 1:1 대화를 시작한다면 방은 시작 순서에 따라서 Kyle-Tom으로 생성될 수도 있고 Tom-Kely로 생성될 수도 있다.</font><br />
<font size=2>그래서 중복 방지를 위해 두 번 검색하는 로직을 추가했다.</font><br /><br />

<font size=2>8. findOrCreateRoom()은 방을 생성하는 역할을 한다.</font><br />
<font size=2>만약 해당 방이 이미 존재한다면 기존 방을 반환한다.</font><br /><br />

<font size=2>9. createMsgDocument()는 메시지를 생성하는 역할을 한다.</font><br /><br />

### groupMsg.js (257p)

<font size=2>그룹 메시지와 관련된 네임스페이스 설정이다.</font><br />
<font size=2>privateMsg와 거의 비슷한 내용을 담고 있다.</font><br />
<font size=2>server 폴더 아래로 groupMsg.js 파일을 생성한다.</font><br />

```
// 1
const { GroupUserList, GroupRoom, GroupMsg } = require("./schema/Group");

const groupMsg = (io) => {
    // 2
    io.of("/group").use(async (socket, next) => {
        const userId = socket.handshake.auth.userId;
        if (!userId) {
            console.log("err");
            return next(new Error("invalid userId"));
        }
        socket.userId = userId;
        await createGroupUser(userId, socket.id);
        next();
    });

    // 3
    io.of("/group").on("connection", async (socket) => {
        const groupRoom = await GroupRoom.find({
            loginUserId: socket.userId,
        }).exec();
        socket.emit("group-list", groupRoom);
        // 4
        socket.on("msgInit", async (res) => {
            const { targetId } = res;
            let roomName = null;
            roomName = targetId.join(",");
            const groupMsg = await GroupMsg.find({
                roomNumber: roomName,
            }).exec();
            io.of("/group")
                .to(roomName)
                .emit("group-msg-init", { msg: groupMsg || [] });
        });
        // 5
        socket.on("reqGroupJoinRoom", async (res) => {
            const { socketId } = res;
            const groupUser = await GroupUserList.find()
                .where("userId")
                .in(socketId.split(","));
            groupUser.forEach((v) => {
                io.of("/group").to(v.socketId).emit("group-chat-req", {
                    roomNumber: socketId,
                    socketId: v.socketId,
                    userId: socket.userId,
                });
            });
        });
        // 6
        socket.on("groupMsg", async (res) => {
            const { msg, toUserSocketId, toUserId, fromUserId, time } = res;
            socket.broadcast.in(toUserSocketId).emit("group-msg", {
                msg: msg,
                toUserId,
                fromUserId,
                toUserSocketId: toUserSocketId,
                time: time,
            });
            await createMsgDocument(toUserSocketId, res);
        });
        // 7
        socket.on("joinGroupRoom", (res) => {
            const { roomNumber } = res;
            socket.join(roomNumber);
        });
        // 8
        socket.on("resGroupJoinRoom", async (res) => {
            const { roomNumber, socketId } = res;
            socket.join(roomNumber);
            await createGroupRoom(socket.userId, roomNumber, roomNumber);

            const groupRoom = await GroupRoom.find({
                loginUserId: socket.userId,
            }).exec();
            io.of("/group").to(socketId).emit("group-list", groupRoom);
        });
    });
};

// 9
async function createGroupRoom(loginUserId, userId, socketId) {
    if (loginUserId == null) return;

    return await GroupRoom.create({
        loginUserId: loginUserId,
        status: true,
        userId: userId,
        socketId: socketId,
        type: "group",
    });
}
// 10
async function createGroupUser(userId, socketId) {
    if (userId == null) return;
    const document = await GroupUserList.findOneAndUpdate(
        { userId: userId },
        { socketId: socketId }
    );
    if (document) return document;

    return await GroupUserList.create({
        status: true,
        userId: userId,
        socketId: socketId,
    });
}
// 11
async function createMsgDocument(roomNumber, res) {
    if (roomNumber == null) return;

    return await GroupMsg.create({
        roomNumber: roomNumber,
        msg: res.msg,
        toUserId: res.toUserId,
        fromUserId: res.fromUserId,
        time: res.time,
    });
}

module.exports.groupMsginit = groupMsg;
```

<font size=2>1. groupMsg.js에는 총 3개의 스키마를 가지고 있다.</font><br />
<font size=2>하나는 그룹 채팅을 사용하는 사용자, 두 번째는 그룹 메시지, 마지막은 그룹방이다.</font><br />
<font size=2>스키마 부분에서 더 자세히 말하겠다.</font><br /><br />

<font size=2>2. 그룹 메시지도 위와 동일하게 서버에서 오는 사용자 아이디를 소켓에 등록한다.</font><br />
<font size=2>추가적으로 createGroupUser()를 이용해서 해당 사용자를 그룹 채팅을 사용하는 사용자에 초기화한다.</font><br /><br />

<font size=2>3. 처음 접속할 때 접속한 사용자가 그룹방을 가지고 있는지 확인한다.</font><br />
<font size=2>find()를 이용해서 해당 사용자의 아이디로 조회한다.</font><br />
<font size=2>'group-list'라는 이벤트로 클라이언트에게 그룹방 리스트를 전송한다.</font><br /><br />

<font size=2>4. 'msgInit'은 그룹방에 처음 입장할 때 과거의 대화 내역을 가져오는 이벤트이다.</font><br />
<font size=2>방 번호로 그룹방의 대화 내역을 가져온다.</font><br />
<font size=2>'group-msg-init' 이벤트를 이용해서 해당 방에 속해 있는 모두에게 이벤트를 전송한다.</font><br /><br />

<font size=2>5. 1:1 채팅과는 다르게 다수의 사용자가 함께 참여하는 방이기 때문에 참여한 모든 사용자에게 초대 메시지를 전송하는 이벤트이다.</font><br />
<font size=2>mongoose의 where, in 문을 이용해서 속한 모든 사람의 데이터를 가져온다.</font><br /><br />

<font size=2>6. 그룹 메시지를 전송하고 저장하는 이벤트이다.</font><br /><br />

<font size=2>7. 'joinGroupRoom' 이벤트는 사용자가 다른 대화를 하다가 다시 그룹방으로 들어왔을 때 호출된다.</font><br />
<font size=2>해당 방에 다시 참여하는 로직을 가지고 있다.</font><br /><br />

<font size=2>8. 방에 초대받은 사용자가 방에 들어가기 위한 기능을 한다.</font><br />
<font size=2>전송된 roomNumber를 이용해서 join()으로 방에 들어간다.</font><br />
<font size=2>createGroupRoom()은 개인이 참가한 방을 생성하는 함수이다.</font><br />
<font size=2>개인마다 참여하는 방이 다르기 때문에 다음과 같은 로직이 추가되었다.</font><br />

```
 socket.join(roomNumber);
 await createGroupRoom(socket.userId, roomNumber, roomNumber);
```

<font size=2>마지막으로 사용자 아이디를 검색해서 그 사용자가 가지고 있는 그룹방을 모두 클라이언트로 전송한다.</font><br /><br />

<font size=2>9. createGroupRoom()은 개인별로 방을 생성하는 함수이다.</font><br /><br />

<font size=2>10. createGroupUser()는 그룹방에 속하기 위한 아이디를 mongoDB에 저장한다.</font><br /><br />

<font size=2>11. createMsgDocument()는 그룹 메시지를 저장하는 함수이다.</font><br /><br />

<font size=2>이렇게 private과 group을 나누는 이유는 로직의 복잡도를 줄이고 코드의 가독성을 높이기 위한 방법이다.</font><br />
<font size=2>사실 private과 group의 로직은 비슷하지만 다른 점이 있다.</font><br />
<font size=2>조금만 다르다는 이유로 같은 곳에 코드를 작성한다면 나중에 관리가 어려워질 수 있다.</font><br />
<font size=2>그래서 약간의 차이가 있지만 아예 분리해서 코드를 관리하는 방법도 좋다.</font><br />
<font size=2>이제 스키마 구조를 살펴보겠다.</font><br />

### 스키마 (263p)

<font size=2>server 폴더 아래에 schema 폴더를 만들고 User.js, Private.js, Group.js 파일을 생성한다.</font><br />

### User.js (263p)

<font size=2>User.js는 사용자 리스트를 정의한 스키마가 있다.</font><br />

```
const { Schema, model } = require("mongoose");

const user = new Schema({
  _id: String,
  status: Boolean,
  userId: String,
  socketId: String,
});

module.exports = model("User", user);
```

<font size=2>User 스키마에는 사용자가 현재 접속했는지 확인할 수 있는 status 속성과 소켓의 현재 연결 값인 socketId가 있다.</font><br />

### Private.js (263p)

<font size=2>Private 스키마에는 두 개의 스키마가 있다.</font><br />
<font size=2>하나는 1:1 채팅방을 저장하는 것이고 다른 하나는 1:1 채팅 대화를 저장하는 스키마이다.</font><br />

```
const { Schema, model } = require("mongoose");

const msg = new Schema({
  roomNumber: String,
  msg: String,
  toUserId: String,
  fromUserId: String,
  time: String,
});

const room = new Schema({
  _id: String,
});

module.exports = {
  PrivateMsg: model("Private-msg", msg),
  PrivateRoom: model("Private-room", room),
};
```

### Group.js (264p)

<font size=2>그룹 채팅을 관리하기 위해서 3개의 스키마를 생성했다.</font><br />

```
const { Schema, model } = require("mongoose");

// 1
const groupUserList = new Schema({
  status: Boolean,
  userId: String,
  socketId: String,
});

// 2
const groupRoom = new Schema({
  loginUserId: String,
  status: Boolean,
  userId: String,
  socketId: String,
  type: String,
});

// 3
const msg = new Schema({
  roomNumber: String,
  msg: String,
  toUserId: String,
  fromUserId: String,
  time: String,
});

module.exports = {
  GroupUserList: model("Group-user", groupUserList),
  GroupRoom: model("Group-room", groupRoom),
  GroupMsg: model("Group-msg", msg),
};
```

<font size=2>1. groupUserList는 그룹 채팅과 관련된 사용자를 따로 관리하기 위해 생성했다.</font><br />
<font size=2>기존에 User 도큐먼트를 그대로 사용하게 된다면 사람마다 다른 그룹 채팅을 구분할 수 없기 때문에 아예 그룹 채팅만을 위한 관리 포인트를 만들었다.</font><br /><br />

<font size=2>2. groupRoom은 그룹 채팅을 위한 스키마이다.</font><br />
<font size=2>하나의 방에는 여러 명의 사용자가 속해 있기 때문에 동일한 객체가 생성되지만 loginUserId는 각각 다르게 만들어진다.</font><br /><br />

<font size=2>3. 그룹 채팅 메시지를 저장하기 위한 스키마이다.</font><br /><br />

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

<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />