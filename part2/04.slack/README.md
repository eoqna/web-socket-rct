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

<font size=2></font><br />
<font size=2></font><br />