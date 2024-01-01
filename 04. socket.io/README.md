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
<font size=2></font><br />