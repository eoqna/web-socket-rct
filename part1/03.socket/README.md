## 03. 소켓 통신 (48p)
<font size=2>소켓 통신을 해야 한다면 갑자기 머리가 멍해지는 경험을 해봤는가?</font><br />
<font size=2>'소켓 통신을 들어만 봤지 이걸 어떻게 구현하는거지?'라는 생각이 들 수도 있다.</font><br />
<font size=2>사실 웹 개발을 하다 보면 소켓 통신을 필수로 해야 되는 것은 아니다.</font><br />
<font size=2>요즘 웹은 HTTP 통신만으로도 충분히 멋진 기능들을 만들어낼 수 있기 때문이다.</font><br />
<font size=2>그러나 더 효율적인 웹 서비스를 위해서라면 소켓 통신은 선택이 아닌 필수이다.</font><br />
<font size=2>예를 들어 우리가 자주 사용하는 좌석 예약 서비스 혹은 채팅 같은 실시간 응답을 요구하는 서비스에서 소켓 통신은 서비스의 주요 기능 중 하나이다.</font><br /><br />

### 네트워크 기본 구조 (48p)
<font size=2>멀고도 가까운 단어인 소켓 통신을 알기 위해선 먼저 기초적인 네트워크 구조와 우리가 자주 사용하는 HTTP 통신을 알 필요가 있다.</font><br />

### OSI 7계층 (48p)
<font size=2>조금은 원론적인 이야기를 해볼까 한다.</font><br />
<font size=2>컴퓨터 공학 교재에서 볼 수 있는 OSI 7계층이라는 단어이다.</font><br />
<font size=2>실제로 인프라를 구축하는 인프라팀이 아니라면 OSI 7계층 같은 단어는 많이 사용하지 않는다.</font><br />
<font size=2>특히 프런트엔드나 백엔드 개발자라면 더더욱 긴가민가할 것이다.</font><br />
<font size=2>가장 기본적인 개념 설명을 이해해야 소켓 통신의 모래성을 쌓지 않을 수 있다.</font><br /><br />

<font size=2>1980년대 인터넷이 보급되면서 네트워크 통신을 하는 회사들이 우후죽순 생겨났다.</font><br />
<font size=2>네트워크 통신을 담당하는 제조사들은 서로 다른 방식으로 통신하기 시작한다.</font><br />
<font size=2>이후에는 당연히 문제가 발생한다.</font><br />
<font size=2>어떤 제조사의 통신 모델에 맞춰야 할까?</font><br /><br />

<font size=2>이렇게 어지러운 네트워크 통신을 정리하기 위해 국제 표준화 기구인 ISO가 나서게 된다.</font><br />
<font size=2>ISO는 네트워크 통신 규약(프로토콜)과 기본적인 네트워크 통신 구조 모델을 정하는데 그게 바로 OSI 7계층이다.</font><br />

![BROWSER_RENDERING](./src/assets/OSI_7.png)

<font size=2>1. 응용계층</font><br />
<font size=2>사용자가 직접적으로 사용하는 인터넷과 이메일이 이 영역에 해당한다.</font><br />
<font size=2>주로 사용자와 인터페이스 역할을 한다.</font><br /><br />

<font size=2>2. 표현계층</font><br />
<font size=2>데이터를 표현하는 역할을 한다.</font><br />
<font size=2>표현하는 방법으로는 데이터 암호화, 복호화, 압축 등이 있다.</font><br /><br />

<font size=2>3. 세션계층</font><br />
<font size=2>두 장치 사이의 동기화를 담당한다.</font><br />
<font size=2>오류가 발생한다면 복구하는 과정이 이루어진다.</font><br /><br />

<font size=2>4. 전송 계층</font><br />
<font size=2>장치 사이의 신뢰성 있는 데이터 전송을 담당한다.</font><br />
<font size=2>그래서 오류 검출과 데이터 흐름 제어 등의 기능을 제공한다.</font><br />
<font size=2>또한 우리가 흔히 알고 있는 포트(port)를 사용해서 데이터를 전송한다.</font><br /><br />

<font size=2>5. 네트워크 계층</font><br />
<font size=2>라우팅의 역할을 맡고 있다.</font><br />
<font size=2>가장 안전하고 빠른 길을 안내한다.</font><br /><br />

<font size=2>6. 데이터 링크 계층</font><br />
<font size=2>물리적 연결을 담당하며 MAC 주소를 이용해서 통신한다.</font><br /><br />

<font size=2>7. 물리 계층</font><br />
<font size=2>전기적, 기계적인 특성을 이용해서 데이터를 전송한다.</font><br />
<font size=2>데이터는 0과 1뿐이며 데이터 전달하는 기능만 있기 때문에 오류 제어와 알고리즘 같은 역할은 할 수 없다.</font><br /><br />

<font size=2>일곱 단계마다 각각의 역할과 프로토콜의 영역이 다르다.</font><br />
<font size=2>여기서 모든 단계를 설명하는 것은 의미가 없다.</font><br />
<font size=2>중요한 점은 송신을 하는 입장에서는 각각의 단계를 거치면서 헤더 정보를 추가해서 수신자에게 보낸다는 사실이다.</font><br />
<font size=2>그러면 이 데이터 덩어리를 받은 수신자는 반대로 헤더의 정보를 해석하면서 정보를 받게 된다.</font><br /><br /><br />

### TCP/IP 계층 (50p)
<font size=2>OSI 7계층의 탄생으로 이제 네트워크 통신에는 평화가 찾아왔다.</font><br />
<font size=2>그러나 한 가지 문제가 있다.</font><br />
<font size=2>인터넷의 발전으로 데이터를 어떻게 하면 원하는 위치에 안정적으로 전송할 수 있는 방법에 대해 고민하게 되었다.</font><br />
<font size=2>이 과정에서 OSI 7계층이라는 거대한 구조보다 조금 더 실무적이고 단순화한 모델을 찾다가 TCP/IP 4계층이 나왔다.</font><br /><br />

![BROWSER_RENDERING](./src/assets/TCP_IP_4.png)

<font size=2>그림으로 봐도 OSI 7계층보다 조금 더 친숙할 것이다.</font><br />
<font size=2>TCP/IP는 컴퓨터 사이의 정보를 주고받을 수 있는 통신 규약(protocol)의 집합을 말한다.</font><br /><br />

<font size=2>TCP(Transmission Control Protocol)는 전송제어 프로토콜로 포트 번호를 사용하며 기기 간의 '안전한' 데이터 전송을 담당한다.</font><br />
<font size=2>여기서 '안전한'을 강조했는데 이유는 신뢰를 보장하지 않는 UDP(User Datagram Protocol)도 있기 때문이다.</font><br />
<font size=2>IP(Internet Protocol)는 기기 간의 가장 빠른 데이터 전송을 담당한다.</font><br />
<font size=2>우리가 흔히 말하는 IP 주소가 바로 여기서 나왔다.</font><br /><br />

<font size=2>우리가 실무에서 가장 많이 사용하는 데이터 통신이라고 하면 응용 계층에 있는 HTTP 프로토콜을 이용한 통신을 이야기한다.</font><br />
<font size=2>앞으로 알아볼 소켓 통신은 전송 계층에 위치한 TCP혹은 UDP 프로토콜을 사용하게 된다.</font><br />
<font size=2>결론적으로 HTTP는 사실 TCP 기반으로 만들어졌기 때문에 소켓 방식으로 만들어졌다고 볼 수 있다.</font><br />

### 소켓 통신 (51p)

<font size=2>앞의 내용을 정리해보겠다.</font><br />
<font size=2>소켓 통신이란 TCP 혹은 UDP 프로토콜을 사용하는 두 기기 간의 연결이다.</font><br />
<font size=2>이런 연결을 하기 위해 특정한 IP 주소와 포트 번호를 이용해서 통신 연결을 유지한다.</font><br /><br />

<font size=2>여기서 중요한 포인트는 '연결'이다.</font><br />
<font size=2>클라이언트와 서버가 실시간으로 데이터를 주고받기 위해선 특정한 연결이 계속 이어져 있어야 한다.</font><br />
<font size=2>흔히 '커넥션'이라고 말하는데 HTTP 통신과는 다르게 연결을 유지하기 위해선 컴퓨터의 자원을 소모하며 커넥션이 많을 수록 부하가 발생한다.</font><br />
<font size=2>그래서 데이터 통신이 자주 일어난다면 양방향 통신인 소켓 통신을 사용하지만 데이터 통신이 자주 발생하지 않는다면 단방향 통신인 HTTP 통신이 적합하다.</font><br />

```
양방향 통신은 소켓 통신만 있을까?

HTTP를 통한 양방향 통신 기법도 있다.

 • 폴링(Polling)
  클라이언트가 특정 시간을 간격으로 계속 서버에 request를 요청하는 방식이다.
  계속 요청해서 응답이 있는지 확인하기 때문에 불필요한 요청과 부하가 발생한다.

 • 롱폴링(Long Polling)
  폴링의 무분별한 확인 요청과 서버 부하를 줄이기 위한 방법이다.
  폴링처럼 지속적으로 확인하는 것이 아닌 서버에서 이벤트가 발생하면 그때 클라이언트에 응답을 주는 방식이다.

 • 스트리밍(Streaming)
  롱 폴링처럼 연결을 맺고 끊는 것이 아니라 지속적인 연결 상태로 서버의 데이터를 클라이언트가 받을 수 있다.

  위 방식들 모두 구현이 단순하다는 장점이 주를 이루지만 HTTP 통신을 기반으로 하기 때문에 큰 헤더 정보는 서버에 부담이 될 수 있다.
  또한 폴링 같은 경우는 사실 실시간 통신으로 보기 어렵다.
```
<br /><br />

### 소켓 통신 프로세스 (52p)

<font size=2>그렇다면 소켓 통신은 어떤 방식으로 이루어지는 걸까?</font><br />
<font size=2>위에서 살펴본 TCP/IP 통신을 토대로 말하겠다.</font><br /><br />

### 3방향 핸드셰이크 (52p)

<font size=2>TCP 통신 혹은 소켓 통신의 원리를 말하다 보면 자연스럽게 나오는 키워드가 3방향 핸드셰이크(3-way-handshake)이다.</font><br />
<font size=2>3방향 핸드셰이크란 신뢰성 있는 연결을 위해 서버와 클라이언트 간의 사전 약속이라 말할 수 있다.</font><br />
<font size=2>앞에서 말한 것처럼 TCP 통신은 신뢰를 기반으로 동작한다.</font><br />
<font size=2>안전한 TCP 통신을 위해선 클라이언트의 요청이 안전하게 서버에 도달하기 위한 사전 작업이 필요하다.</font><br />
<font size=2>이런 사전 작업은 다음과 같이 이루어진다.</font><br /><br />

```
  1. 소켓 통신을 위해 사전에 클라이언트는 SYN이라는 패킷을 서버에 전송하고 SYN/ACK를 받기 위한 상태로 대기한다.
  2. SYN 패킷을 받은 서버는 클라이언트에서 받은 SYN 패킷과 잘 받았다는 패킷인 ACK를 하나로 만들어서 다시 클라이언트에 SYN/ACK를 전송한다.
  3. ACK를 받은 클라이언트는 다시 서버로 ACK 패킷을 보내며 잘 받았다는 요청을 보내게 된다.
```

<font size=2>위의 일련의 과정이 3단계로 이루어져 3방향 핸드셰이크라고 한다.</font><br />
<font size=2>3방향 핸드셰이크 이후 데이터를 서로 주고받을 수 있는 소켓 통신이 이뤄진다.</font><br />

```
UDP 통신은 3방향 핸드셰이크가 없나요?

UDP는 비신뢰성 연결을 지향하기 때문에 없다.
신뢰성을 보장하지 않기 때문에 UDP는 TCP와는 다르게 빠른 성능을 가지고 있다.
이런 특징을 기반으로 연속적인 데이터가 필요할 때는 UDP 프로토콜을 사용한다.
```

### net 모듈을 이용한 TCP 서버 (53p)

<font size=2>드디어 지루했던 소켓의 이론 수업이 끝났다.</font><br />
<font size=2>사실 소켓 구현보다 이론이 더 어렵다는 생각도 든다.</font><br />
<font size=2>이제는 직접 구현해보겠다.</font><br />
<font size=2>거창한 이론과는 다르게 직접 구현한다면 이런 생각을 할 것이다.</font><br />
<font size=2>'이론은 거창하던데... 이렇게 간단하다고...?'</font><br /><br />

<font size=2>앞의 이론에 따르면 소켓은 TCP, UDP 프로토콜을 사용한다고 배웠다.</font><br />
<font size=2>그렇다면 이번에는 nodejs를 이용해서 간단한 소켓 통신을 구현해보겠다.</font><br />

### 프로젝트 초기 설정 (54p)

<font size=2>간단하게 만들어볼 예제는 클라이언트에서 서버로 1초마다 'Hello.'를 전송하는 예제이다.</font><br />
<font size=2>아래 로그는 서버 콘솔에 노출되는 모습을 보여준다.</font><br />

```
From client: Hello.
From client: Hello.
From client: Hello.
From client: Hello.
From client: Hello.
```

<font size=2>먼저 테스트할 폴더를 생성해준다.</font><br />
<font size=2>'net-module'이라는 폴더를 생성하겠다.</font><br />
<font size=2>아래에 server.js와 client.js를 생성한다.</font><br />
<font size=2>코드 편집기에서 net-module 폴더를 연다.</font><br />

### server.js (54p)

<font size=2>이제 서버 사이드인 server.js부터 구현을 시작하겠다.</font><br />
<font size=2>nodejs에서 제공하는 내장 모듈인 net 모듈을 사용하겠다.</font><br />

```
net 모듈

net 모듈은 TCP 스트림 기반의 비동기 네트워크 통신을 제공하는 모듈이다.
nodejs에서는 net 모듈을 통해서 간단히 서버와 클라이언트 통신을 설계할 수 있다.
하지만 net 모듈은 저수준의 TCP 통신을 제공하기때문에 브라우저와 서버의 통신은 지원하지 않는다.
```

```
server.js

// 1
const net = require("net");

// 2
const server = net.createServer((socket) => {
  // 3
  socket.on("data", (data) => {
    console.log("From client:", data.toString());
  });

  // 4
  socket.on("close", () => {
    console.log("client disconnected.");
  });

  // 5
  socket.write("welcome to server");
});

server.on("error", (err) => {
  console.log("err" + err);
});

// 6
server.listen(5000, () => {
  console.log("listen on 5000");
});
```

<font size=2>1. net 모듈을 추가한다.</font><br />
<font size=2>2. createServer()를 이용해 TCP 서버를 생성한다.</font><br />
<font size=2>3. "data"라는 구분자로 클라이언트에서 오는 값을 받는다.</font><br />
<font size=2>4. "close"는 net 모듈에 등록된 키워드로 클라이언트에서 소켓을 닫을 때 응답한다.</font><br />
<font size=2>5. write()를 이용해 서버에서 클라이언트로 메시지를 전달한다.</font><br />
<font size=2>6. 5000번 포트를 열고 기다린다.</font><br />

### client.js (56p)

<font size=2>이번에는 client.js를 구현하겠다.</font><br />

```
client.js

const net = require("net");

// 1
const socket = net.connect({ port: 5000 });
socket.on("connect", () => {
  console.log("connected to server!");
  // 2
  setInterval(() => {
    socket.write("Hello.");
  }, 1000);
});

// 3
socket.on("data", (chunk) => {
  console.log("From Server:" + chunk);
});

// 4
socket.on("end", () => {
  console.log("disconnected.");
});

socket.on("error", (err) => {
  console.log(err);
});

// 5
socket.on("timeout", () => {
  console.log("connection timeout.");
});
```

<font size=2>1. connect()를 사용해 5000번 포트의 서버에 접속을 시도한다.</font><br />
<font size=2>2. 1초 간격으로 서버에 "Hello." 메시지를 요청한다.</font><br />
<font size=2>3. "data" 구분자로 서버에서 오는 데이터를 수신한다.</font><br />
<font size=2>4. 서버 연결이 끊길 때 응답한다.</font><br />
<font size=2>5. 연결이 지연될 때 출력한다.</font><br /><br />

<font size=2>이제 server.js부터 실행해보겠다.</font><br />
<font size=2>터미널 창을 열고 다음과 같은 명령어를 입력한다.</font><br />

```
> cd net-module
> node server.js
listen on 5000
```

<font size=2>위와 같이 나오면 server.js가 정상적으로 실행된 것이다.</font><br />
<font size=2>이번에는 별도의 터미널을 열고 클라이언트를 실행해보겠다.</font><br />

```
> cd net-module
> node client.js
connected to server!
From Server:welcome to server
```

<font size=2>클라이언트도 정상적으로 실행됐다.</font><br />
<font size=2>다시 돌아와서 서버 사이드 터미널을 확인한다.</font><br />

```
From client: Hello.
From client: Hello.
From client: Hello.
From client: Hello.
From client: Hello.
...
```

<font size=2>서버 로그를 보면 1초 간격으로 클라이언트에서 보내는 메시지가 정삭적으로 출력되는 것을 볼 수 있다.</font><br />
<font size=2>ctrl + c를 눌러서 실행을 중지한다.</font><br />

### HTML5 웹 소켓 채팅 서비스 (57p)

<font size=2>위에서 net 모듈을 이용한 TCP 서버를 만들었다.</font><br />
<font size=2>그러나 터미널로만 실행하다 보니 조금은 지루한 느낌이 있다.</font><br />
<font size=2>이번에는 UI를 포함한 브라우저를 이용해서 통신하겠다.</font><br /><br />

<font size=2>HTML5의 등장과 함께 프런트엔드 개발 환경은 엄청난 변화를 겪게 되었다.</font><br />
<font size=2>이유는 어마어마한 API와 기능을 제공했기 때문이다.</font><br />
<font size=2>예를 들어 HTML5 이전에는 얻기 힘든 위치 정보 데이터를 브라우저 수준에서 손쉽게 다룰 수 있었다.</font><br />
<font size=2>그중 하나가 지금 알아볼 HTML5 웹 소켓이다.</font><br />

```
HTML5 웹 소켓의 한계

HTML5와 함께 등장한 웹 소켓은 IE8과 같은 하위 브라우저에서는 사용하지 못하는 단점이 있다.
또한 TCP를 기반으로 하는 브라우저는 HTTP 통신을 사용하기 때문에 비연결을 지향하는 UDP 기반으로는 사용할 수 없다.
```

```
RFC 6455

웹 소켓이나 소켓을 공부하다 보면 RFC라는 용어를 마주치게 된다.
RFC(Request For Comments)는 국제 인터넷 표준화 기구인 IETF(Internet Engineering Task Force)에서 관리하는 표준화 문서를 말한다.

인터넷 세상에서 표준은 중요하다.
표준을 통해서 신뢰성 있는 데이터 교환을 이룰 수 있고 간편한 방법으로 다양한 연결점들과 동기화할 수 있기 때문이다.
이런 표준화 작업 중에서 RFC 6455는 웹 소켓 표준을 정의한 문서이다.
시간이 있다면 인터넷에 RFC 6455를 검색해서 문서를 읽어보는 것을 추천한다.
```

<font size=2>앞에서 배웠던 리엑트를 기반으로 HTML5 웹 소켓을 이용한 채팅 서비스를 만들어 보겠다.</font><br />
<font size=2>채팅 서비스의 이름은 WebChat이다.</font><br /><br />

<font size=2>WebChat의 기능은 간단하다.</font><br />
<font size=2>첫 페이지에서 자신이 원하는 아이디를 입력하고 로그인한다.</font><br /><br />

<font size=2>로그인하게 되면 채팅 페이지로 전환된다.</font><br />
<font size=2>채팅 페이지에서는 본인이 말한 내용은 왼쪽에 정렬되고 다른 사용자가 말한 내용은 오른쪽에 정렬된다.</font><br />
<font size=2>새로운 사용자가 등장하면 'Tom joins the chat'이라는 메시지를 출력한다.</font><br />

### 프로젝트 초기 설정 (59p)

<font size=2>먼저 html5-websocket이라는 폴더를 만들고 그 아래에 client, server라는 폴더를 생성한다.</font><br />
<font size=2>client 폴더의 경우는 npx를 이용해서 CRA로 프로젝트를 생성할 예정이다.</font><br />

```
> mkdir html5-websocket
> cd html5-websocket
> mkdir server
> npx create-react-app client
```

<font size=2>명령 실행이 완료되면 코드 편집기에서 html5-websocket 폴더를 연다.</font><br />

### 클라이언트 사이드 (59p)

<font size=2>client 폴더 파일 중 다음과 같이 사용하지 않는 부분은 삭제하겠다.</font><br />

```
- App.test.js
- logo.svg
- reportWebVital.js
- setupTests.js
```

<font size=2>client/src/index.js에서 사용하지 않는 부분을 제거하겠다.</font><br />

```
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);  
```

<font size=2>client/src/App.js의 logo 파일을 사용하는 부분도 삭제한다.</font><br />

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

<font size=2>images 폴더를 생성해서 처음 진입할 때 보여지는 이미지 파일을 추가한다.</font><br />

```
> cd client/src
> mkdir images
```

```
이미지 파일 확인하기

프로젝트에 사용되는 파일은 깃허브 주소를 참고하면 된다.
https://github.com/devh-e/socket-programming-using-react/tree/master/part1/socket/html5-websocket/client/src/images
```

<font size=2>해당 주소에서 다운로드한 websocket.png 파일을 images 폴더에 넣는다.</font><br />

### App.js (61p)

```
import React, { useState, useEffect, useRef } from "react";
import './App.css';
import logo from "./images/websocket.png";

// 1
const websocket = new WebSocket("ws://localhost:5000");

const App = () => {
  // 2
  const messagesEndRef = useRef(null);
  const [ userId, setUserId ] = useState("");
  const [ isLogin, setIsLogin ] = useState(false);
  const [ msg, setMsg ] = useState("");
  const [ msgList, setMsgList ] = useState([]);

  // 3
  useEffect(() => {
    if( !websocket ) return;

    websocket.onopen = function () {
      console.log("open", websocket.protocol);
    }

    websocket.onmessage = function (e) {
      const { data, id, type } = JSON.parse(e.data);
      setMsgList((prev) => [
        ...prev,
        {
          msg: type === "welcome" ? `${data} joins the chat` : data,
          type: type,
          id: id,
        },
      ]);
    };
  }, []);

  // 5
  useEffect(() => {
    scrollToBottom();
  }, [msgList]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 6
  const onSubmitHandler = (e) => {
    e.preventDefault();
    const sendData = {
      type: "id",
      data: userId,
    };

    websocket.send(JSON.stringify(sendData));
    setIsLogin(true);
  };

  // 7
  const onChangeUserIdHandler = (e) => {
    setUserId(e.target.value);
  };

  // 8
  const onSendSubmitHandler = (e) => {
    e.preventDefault();
    const sendData = {
      type: "msg",
      data: msg,
      id: userId,
    };

    websocket.send(JSON.stringify(sendData));
    setMsgList((prev) => [...prev, { msg: msg, type: "me", id: userId }]);
    setMsg("");
  }

  // 9
  const onChangeMsgHandler = (e) => {
    setMsg(e.target.value);
  };

  return (
    <div className="app-container">
      <div className="wrap">
        {isLogin ? (
          // 10
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
              <div>WebChat</div>
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

<font size=2>1. new WebSocket()을 이용해서 웹 소켓 객체를 초기화하고 연결하는 작업이다.</font><br />
<font size=2>웹 소켓 서버를 5000번 포트로 만들 예정이다.</font><br />
<font size=2>그래서 localhost:5000을 연결 주소로 입력했다.</font><br />

```
const websocket = new WebSocket("ws://localhost:5000");

네이티브(native)기능이기 때문에 서버처럼 별도의 모듈을 추가하는 작업은 필요하지 않다.
주의할 점은 연결할 웹 소켓 주소에 ws:을 붙인다는 것이다.
ws는 웹 소켓을 의미한다.
ws://[호스트주소]:[포트번호]로 소켓을 연결한다.
```

```
wss와 ws

wss는 ws를 보안적으로 업그레이드한 프로토콜이라고 생각하면 된다.
그래서 실제 웹 서비스에서는 wss 사용을 추천한다.
```
<br />

<font size=2>2. WebSocket에 필요한 상태 변수들을 정의한다.</font><br />

```
const [ msgList, setMsgList ] = useState([]);

메시지 내용은 배열 형태로 저장하고 리스트를 이용해서 차례로 출력된다.
```
<br />

<font size=2>3. useEffect()를 이용해서 웹 소켓의 메소드를 정의한다.</font><br />
<font size=2>• onopen : 처음 소켓이 연결되면 실행된다.</font><br />
<font size=2>• onmessage : 가장 중요한 메소드로, 서버에서 온 메세지를 받는다.</font><br />
<font size=2>• onclose : 소켓 연결이 종료되면 실행된다.</font><br /><br />

<font size=2>4. 서버에서 온 메시지를 받는다.</font><br />

```
const { data, id, type } = JSON.parse(e.data);

JSON.parse()를 사용하는 이유는 문자열 형태로 메시지가 전송되기 때문이다.
```

```
setMsgList((prev) => [
  ...prev,
  {
    msg: type === "welcome" ? `${data} joins the chat` : data,
    type: type,
    id: id,
  },
]);

받은 메시지는 msgList의 상태로 관리된다.
넘어온 값의 type은 두 가지로 welcome과 other이다.
welcome은 최초의 진입 메시지이다.
other은 남에게서 받은 메시지를 오른쪽에 나타내기 위해 사용된다.
```
<br />

<font size=2>5. 자동으로 스크롤을 내리도록 한다.</font><br />
<font size=2>scrollIntoView()를 이용해서 손쉽게 구현할 수 있다.</font><br />

```
messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
```
<br />

<font size=2>5. 로그인할 때 아이디를 입력한 후 Login 버튼을 클릭하면 실행된다.</font><br />

```
const onSubmitHandler = (e) => {
  e.preventDefault();
  const sendData = {
    type: "id",
    data: userId,
  };

  websocket.send(JSON.stringify(sendData));
  setIsLogin(true);
};

웹 소켓의 send() 메소드는 서버로 메시지를 전송할 때 사용한다.
우리가 전송할 내용은 type과 사용자 아이디이다.
또한 데이터는 문자열로 관리되기 때문에 JSON.stringify()로 변환한 후 전송한다.
```
<br />

<font size=2>7. 아이디 입력을 관리하는 함수이다.</font><br /><br />

<font size=2>8. send 버튼을 클릭하면 실행된다.</font><br />

```
const onSendSubmitHandler = (e) => {
  e.preventDefault();
  const sendData = {
    type: "msg",
    data: msg,
    id: userId,
  };

  websocket.send(JSON.stringify(sendData));
  setMsgList((prev) => [...prev, { msg: msg, type: "me", id: userId }]);
  setMsg("");
};

내가 보낸 메시지가 다른 사람들에게 모두 전송되기 위해서 send() 메소드로 내용을 전송한다.
마지막으로 setMsgList()로 현재 입력된 메시지를 바로 화면에 출력한다.
```
<br />

<font size=2>9. 메시지를 입력할 때 실행된다.</font><br /><br />

<font size=2>10. isLogin이라는 값으로 로그인 화면인지 채팅 화면인지를 구분한다.</font>
<br /><br /><br />

### App.css (67p)

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
<br />

### 서버 사이드 (70p)

<font size=2>이제 서버 사이드를 구현하겠다.</font><br />
<font size=2>server 폴더로 들어가 npm 패키지를 이용해 nodejs 서버를 설정한다.</font><br />
<font size=2>server 폴더 안에 server.js 파일을 생성한다.</font><br />

```
> cd server
> npm init y
```

<font size=2>package.json 파일을 열어 확인해본다.</font><br />

```
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js"
  },
  "author": "dbshin",
  "license": "ISC"
}

```

### server.js (71p)

```
필요한 라이브러리
 • ws : nodejs 소켓 구현을 위한 라이브러리이다.

 > npm install ws
```

```
왜 net 모듈을 사용하지 않고 외부 모듈인 ws를 사용하나요?

예제에서 사용하는 패키지는 ws 8 버전을 사용한다.
이렇게 외부 모듈을 사용하는 이유는 편리성 때문이다.
내부 모듈인 net 모듈을 이용해 HTTP 서버와 TCP 서버를 모두 설정할 수 있지만 많은 수작업을 동반한다.
그래서 간편하게 소켓 서버를 작성할 수 있는 ws 모듈을 사용한다.

ws 모듈은 다양한 기능을 간편하게 사용할 수 있다.
connection, message, close 관리와 스트림(stream), 브로드캐스트(broadcast)까지 큰 어려움 없이 사용할 수 있다.
하지만 서버에서만 사용할 수 있기 때문에 브라우저에서 쓰고 싶다면 HTML5에서 제공하는 웹 소켓 API를 사용해야 한다.
```

<font size=2>아래는 package.json 소스 모습이다.</font><br />

```
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js"
  },
  "author": "dbshin",
  "license": "ISC",
  "dependencies": {
    "ws": "^8.15.1"
  }
}
```

```
// 1
const WebSocket = require("ws");

// 2
const wss = new WebSocket.Server({ port: 5000 });

// 3
wss.on("connection", (ws) => {
  // 4
  const broadCastHandler = (msg) => {
    wss.clients.forEach(function each(client, i) {
      if( client !== ws && client.readyState === WebSocket.OPEN ) {
        client.send(msg);
      }
    });
  };

  // 5
  ws.on("message", (res) => {
    const { type, data, id } = JSON.parse(res);

    switch(type) {
      case "id":
        broadCastHandler(
          JSON.stringify({ type: "welcome", data: data })
        );
        break;
      case "msg":
        broadCastHandler(
          JSON.stringify({ type: "other", data: data, id: id })
        );
        break;
      default:
        break;
    }
  });

  ws.on("close", () => {
    console.log("client was disconnected");
  });
});
```

<font size=2>1. ws 모듈을 추가한다.</font><br />
<font size=2>2. ws 모듈을 이용해 5000번 포트로 접속할 수 있는 웹 소켓 서버를 생성한다.</font><br />
```
 const wss = new WebSocket.Server({ port: 5000 });
```
<font size=2>3. ws 모듈에서 on()을 이용해 connection, message, close와 같은 상태를 확인할 수 있다.</font><br />
<font size=2>4. ws 모듈은 접속한 사용자에게 동일한 메세지를 출력하기 위한 브로드캐스트(broadcast)라는 메소드를 정의하고 있지 않다.</font><br />
<font size=2>그래서 브로드캐스트 기능을 하는 broadCastHandler()라는 함수를 정의했다.</font><br />
<font size=2>내가 보낸 메시지를 내가 다시 받지 않기 위해서 조건문에 client !== ws를 추가했다.</font><br />
```
if( client !== ws && client.readyState === WebSocket.OPEN ) {
  client.send(msg);
}
```

<font size=2>5. 클라이언트에서 오는 메시지를 수신한다.</font><br />
<font size=2>switch 문을 이용해서 클라이언트에서 오는 정보를 구분한다.</font><br />
<font size=2>id로 온다면 최초 메시지는 welcome 메시지이다.</font><br />
<font size=2>수신한 메시지는 우리가 정의한 broadCastHandler() 함수를 이용해 다른 사용자에게 전달된다.</font><br /><br />

<font size=2>우리가 만든 채팅 서비스를 실행해보겠다.</font><br />
<font size=2>준비물은 두 개의 터미널 창이다.</font><br />
<font size=2>먼저 server의 루트 경로로 이동해서 npm run start를 실행해준다.</font><br />

```
> cd server
> npm run start
```

<font size=2>다음은 client 폴더로 이동한 후에 npm run start를 실행한다.</font><br />

```
> cd client
> npm run start
```

<font size=2>이제 브라우저 창을 열고 http://localhost:3000으로 접속한다.</font><br />
<font size=2>먼저 "Tom"으로 로그인 한 후 새로운 브라우저 창을 열고 http://localhost:3000 으로 접속한다.</font><br />
<font size=2>그리고 "Jane"으로 로그인하게 되면 "Tom"으로 로그인한 브라우저 창에 Jane이 연결됐다는 문구가 뜰 것이다.</font><br />
<font size=2>대화창에 문구를 입력하고 "send"를 누르면 대화가 정상적으로 오고가는 것을 확인할 수 있다.</font><br /><br />

<font size=2>여기서 한 가지 확인해야 할 사항이 있다.</font><br />
<font size=2>앞의 채팅 데이터 전송이 진짜 웹 소켓으로 이루어졌는지 어떻게 알 수 있을까?</font><br />
<font size=2>확인하기 위해 개발자 도구의 네트워크 창을 열어보겠다.</font><br /><br />

<font size=2>localhost 부분을 확인해보면 처음 소켓 연결을 요청할 때 Connection이라는 항목을 볼 수 있다.</font><br />
<font size=2>Upgrade:websocket 부분도 확인된다.</font><br />
<font size=2>앞서 살펴본 3방향 핸드셰이크의 과정은 사실 클라이언트가 브라우저에게 "소켓 통신 가능하니?"라고 물어보는 것과 같다.</font><br />
<font size=2>이런 질문을 요청 헤더에 실어서 날린다.</font><br />
<font size=2>위 부분에서 클라이언트는 서버에게 "소켓 통신이 가능하다면 웹 소켓 프로토콜로 업그레이드 해줘."라고 요청하는 것이다.</font><br /><br />

<font size=2>서버는 응답으로 101이라는 상태를 전달하면 그때부터 HTTP 프로토콜이 아닌 웹 소켓 프로토콜로 통신하게 된다.</font><br />