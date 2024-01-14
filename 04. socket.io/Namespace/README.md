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
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />
<font size=2></font><br />