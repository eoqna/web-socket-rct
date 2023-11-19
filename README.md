# 리엑트로 배우는 소켓 프로그래밍
<br />

## 01. React
<br />

<font size=2>state of js에서 발표한 프런트엔드 프레임워크의 사용량을 보면 React의 사용량은 지속적으로 증가한 것을 볼 수 있다.</font><br />
<font size=2>React는 페이스북에서 개발한 JavaScript UI 라이브러리이다.</font><br />
<font size=2>어떤 분들은 Framework라 부르기도 한다.</font><br />
<font size=2>특정한 형식을 강제하는 Framework와는 다르게 React는 별도의 기능만을 적용해서 제품을 개발할 수 있게 설계되어있다.</font><br />
<font size=2>여기서 말하는 별도의 기능이 바로 React의 핵심인 UI이다.</font><br /><br />

<font size=2>Angular, Vue.js와 같은 Framework는 MVC(Model-View-Controller) 모델 혹은 MVVM(Model-View-View Model) 모델을 지향한다.</font><br />
<font size=2>이런 모델에 따라 데이터와 뷰가 유기적으로 관리되고 있다.</font><br />
<font size=2>그러나 React는 이런 틀에서 벗어나 오직 사용자에게 보여지는 View만을 생각해서 만들었다.</font><br />
<font size=2>페이스북에서는 이런 View를 사용자 입장에서 어떻게 하면 자연스럽게 보일까 연구하다가 가상 DOM(Virtual DOM)을 생각하게 되었다.</font>
<br /><br /><br />

### 01-1. Virtual DOM
<br />

<font size=2>DOM(Document Object Model)은 웹 페이지의 구조와 내용을 표현하는 역할을 한다.</font><br />
<font size=2>HTML, CSS와 같은 정적 파일이 브라우저에 렌더링을 시작하면 HTML 코드를 브라우저가 이해할 수 있는 구조로 변환하여 DOM 트리(DOM tree)를 생성한다.</font><br />
<font size=2>DOM 트리는 계층 구조로 표현되어 있어 요소들이 부모-자식 관계로 연결된다.</font><br />

![HTML_DOM_TREE](./src/assets/HTML_DOM_Tree.png)

<font size=2>HTML 문서를 파싱하여 DOM 트리를 생성하면 CSS 파일을 파싱하여 CSSOM 트리를 생성한다.</font><br />
<font size=2>그런 다음, DOM 트리와 CSSOM 트리를 결합하여 렌더 트리를 생성한다.</font><br />
<font size=2>렌더 트리는 화면에 실제로 표시되는 요소들을 포함한다.</font><br />
<font size=2>브라우저는 렌더 트리를 이용해 화면에 표시될 영역을 계산하는 레이아웃(리플로우) 과정과 노드를 화면에 픽셀로 변환하는 리페인트 과정을 거쳐 변환된 내용이 화면에 표시되어 사용자에게 웹 페이지가 보여진다.</font><br />

![BROWSER_RENDERING](./src/assets/Rendering.png)

<font size=2>위에서 설명한 과정에 따라 초기에 렌더링된 웹 서비스가 있다고 가정하겠다.</font><br />
<font size=2>이 웹 서비스의 상단에 햄버거 버튼이 있다.</font><br />
<font size=2>사용자가 햄버거 버튼을 누르면 위에서 아래로 사이드 메뉴가 나타난다.</font><br />
<font size=2>이때 나타나는 사이드 메뉴를 CSS의 height로 조작하는데, 이런 과정을 리플로우라고 한다.</font><br />
<font size=2>리플로우는 DOM의 변화로 일어나게 된다.</font><br />
<font size=2>DOM 구조를 변경하는 과정은 일반적으로 빠르게 진행되며, CPU 자원을 적게 소모한다.</font><br />
<font size=2>그러나 DOM 트리의 깊이가 깊고 노드의 수가 많을수록 속도가 떨어진다.</font><br />
<font size=2>여기서 한 가지 생각해볼 문제가 있다.</font><br />
<font size=2>DOM 변화 속도에 왜 노드 수와 트리의 깊이가 영향을 준다는 것일까?</font>
<br /><br /><br />

### 01-2. 비교 알고리즘
<br />

<font size=2>DOM을 변경하면 변화된 노드를 찾는 데 시간이 걸린다.</font><br />
<font size=2>앞의 예시처럼 사이드 메뉴의 높이를 담당하는 노드를 찾기 위해서는 Root 노드부터 하나씩 탐색을 시작한다.</font><br />
<font size=2>이때 비교 알고리즘(Diffing Algorithm)이라는 탐색 방법을 사용한다.</font><br />
<font size=2>그래서 노드의 개수가 많고 렌더 트리의 깊이가 깊을수록 시간이 오래 걸린다.</font><br />

![BROWSER_RENDERING](./src/assets/Changed_Node_Image.png)

<font size=2></font>따라서 변화하는 리페인트, 리플로우 과정을 줄인다면 사용자에게 더 자연스러운 화면과 성능을 제공할 수 있다.<br />

```
DOM은 무조건 느린가?
React가 뜨면서 DOM이 느리다는 의견이 나왔지만 사실 DOM은 충분히 빠르다.
단지 인터렉션이 많거나 많은 변화가 있는 웹 페이지에서는 올바른 성능을 발휘하지 못할 뿐이다.
만약 정적인 페이지라면 오히려 기존 DOM을 이용해서 작업하는 게 좋을 수 있다.
```
<br /><br /><br />

### 01-2. 가상 DOM의 탄생
<br />

<font size=2>React 팀은 어떻게 하면 화면을 다시 그리는 리페인트와 리플로우 과정을 개선할 수 있을까 고민하다가 가상 DOM을 생각하게 된다.</font><br />

![BROWSER_RENDERING](./src/assets/Virtual_DOM.png)

<font size=2>가상 DOM의 원리는 간단하다.</font><br />
<font size=2>초기에 렌더링된 렌더 트리의 모양과 메모리상에 임시로 저장해둔 렌더 트리의 모양을 비교하는 것이다.</font><br />
<font size=2>여기서 말하는 메모리에 있는 렌더 트리가 바로 가상 DOM이다.</font><br />
<font size=2>하지만 여기서 비교하는 방식은 기존의 비교 알고리즘과 다르다.</font><br />
<font size=2>기존의 비교 알고리즘은 루트 노드부터 비교 분석했지만, React는 변경된 노드만 검색해서 변경 사항을 반영한다.</font><br />
<font size=2>그 변경 사항을 계속해서 실제 DOM에 반영하지 않고 딱 한 번에 몰아서 실제 변경 사항을 반영한다.</font><br />
<font size=2>이런 일련의 과정을 조화(Reconciliation) 과정이라고 한다.</font><br /><br />

<font size=2>가상 DOM을 사용하는 이유는 렌더 트리를 직접 조작하는 것보다 가상 DOM을 수정하여 필요한 변경 사항을 파악하고 반영하는 것이 효율적이기 때문이다.</font><br />
<font size=2>가상 DOM은 메모리상에 존재하기 때문에 실제 DOM을 조작하는 것보다 빠르게 변경 사항을 파악하고 적용할 수 있다.</font><br />
<font size=2>이를 통해 웹 애플리케이션의 성능을 높일 수 있다.</font>
<br /><br /><br />

## 02. React 대표 기능
<br />

<font size=2>이제는 React를 어떻게 사용하는지 알아보겠다.</font><br />
<font size=2>사실 React 사용법만 제대로 설명하려고 해도 책 한 권 분량이 나온다.</font><br />
<font size=2>이 책에서는 실전에서 바로바로 사용할 수 있는 주요 기능만 설명하려 한다.</font><br />
<font size=2>이 기능을 이용해서 앞으로 진행될 모든 예제를 만들어볼 것이다.</font>
<br /><br /><br />


### 02-1. React 프로젝트 준비
<br />

<font size=2>React 프로젝트를 시작하려면 제일 먼저 npm (Node Package Manager)을 설치해야 한다.</font><br />
<font size=2>npm은 nodejs에서 사용할 수 있는 패키지 (소프트웨어) 관리 툴을 말한다.</font><br />
<font size=2>과거에는 필요한 라이브러리가 있다면 직접 다운로드해서 프로젝트에 파일을 삽입하거나 혹은 CDN 주소를 import 했지만</font><br />
<font size=2>이제는 npm에서 제공하는 명령어를 통해서 손쉽게 이용하고 관리할 수 있다.</font><br />

```
 npm install jquery
```

<font size=2>위 명령어는 npm을 이용해서 프로젝트에 jquery를 설치하는 명령어이다.</font><br />
<font size=2>npdejs 사이트에 접속해서 자신의 운영체제에 맞는 LTS 버전을 다운로드한다.</font><br />
<font size=2>아래처럼 터미널에서 nodejs와 npm 버전 정보를 입력해서 정상적으로 출력되면 성공이다.</font><br />

```
 > node -v
 node version 출력
 > npm -v
 npm version 출력
```

<font size=2>이제 위에서 준비한 npm을 이용해서 React 프로젝트를 만든다.</font><br />
<font size=2>React 프로젝트를 시작하기 위해선 npm install react 명령어로 React를 설치하면 된다.</font><br />
<font size=2>그러나 이렇게 설치하면 바펠이나 웹팩 등 다양한 설정을 하나씩 수동으로 해야 되기 때문에 번거롭다.</font><br />
<font size=2>그래서 React 프로젝트를 간단하게 시작할 수 있는 CRA(creat-react-app)라는 간편한 도구를 사용한다.</font><br />
<font size=2>CRA는 React 프로젝트를 개발하는 데 필요한 여러 가지 도구와 설정들이 미리 포함된 종합선물 패키지 역할을 한다.</font><br />
<font size=2>다음에는 CRA를 이요해서 만든 간단한 input 예제를 소개하겠다.</font><br />
<font size=2>input 예제 코드를 보면서 React에서 제공되는 대표 기능을 살펴보겠다.</font><br />

```
vite로 시작하는 React?
React 프로젝트를 간편하게 시작하기 위해서 무조건 CRA를 사용해야 하는 건 아니다.
요즘에는 vite라는 번들링 툴을 이용해서 더욱 빠르게 프로젝트를 시작할 수 있다.
하지만 CRA에서 제공되는 부수적인 기능(lint, pwa 등)이 없기 때문에 따로 설치해야 해서 번거롭다
▪ 참고 : https://vitejs.dev/guide
```
<br /><br /><br />

### 02-2. React 대표 함수
<br />

<font size=2>이번 input 예제는 직접 구현하지 않는다.</font><br />
<font size=2>구현된 예제 이미지와 코드를 보면서 React의 기능을 알아보려고 한다.</font><br />
<font size=2>다음 파트에서 더 머진 React 예제를 만들어 볼 것이다.</font><br />
<font size=2>다음 그림의 input 박스는 간단하게 텍스트를 입력받는 기능이 있다.</font><br />
<font size=2>입력받은 내용은 바로 하단에 출력된다.</font><br />
<font size=2>처음에 출력되는 'Hi'는 input 박스의 초기값이다.</font><br />
<font size=2>만약 input 박스에 'Hello'를 입력하면 아래처럼 그대로 노출된다.</font><br />

![BROWSER_RENDERING](./src/assets/Input_Box.png)

<font size=2>이제 코드를 살펴보겠다.</font><br />

```
// 1
import React, { useState, useEffect, useRef } from "react";
import ./App.css;

const App = () => {
    // 2
    const textRef = useRef("");
    // 3
    const [ text, setText ] = useState("");
    // 4
    useEffect(() => {
        setText("Hi");
        console.log("once");
    }, []);
    // 5
    useEffect(() => {
        console.log(textRef.current);
    }, [text]);
    // 6
    const onTextStateChangeHandler = (e) => {
        const msg = e.target.value;
        setText(msg);
    };
    return (
        // 7
        <div className="App">
            <input 
                ref={textRef}
                className="text-input"
                type="text"
                value={text}
                onChange={onTextStateChangeHandler}
                placeholder="Enter yout Message"
            />
            <div>Message: {text}</div>
        </div>
    );

    export default App;
}
```

<font size=2>사실 이번 예제의 input 박스는 리엑트 기능을 설명하기 위한 억지스러운 점이 있다.</font><br />
<font size=2>하지만 간단할수록 확실히 이해할 수 있다는 장점이 있다.</font><br />
<font size=2>하나씩 살펴보겠다.</font><br /><br />
<font size=2>1. 상태</font><br />
<font size=2>React의 핵심은 바로 상태(status) 관리이다.</font><br />
<font size=2>React는 상태를 이용해서 모든 변수와 레이어 변화를 다룰 수 있다.</font><br />
<font size=2>이런 상태를 관리하기 위해선 React에서 제공하는 함수를 추가해야 한다.</font><br />
<font size=2>대표적인 함수로는 useState, useEffect, useRef가 있으며 이러한 함수를 훅(hook) 함수라고 한다.</font><br />
<font size=2>React 버전 16.8 이상부터는 함수형 컴포넌트 클래스형 컴포넌트를 대체하는 주요한 방식이 되었다.</font><br />
<font size=2>이전에는 클래스형 컴포넌트를 사용하여 상태 관리와 생명주기 메소드를 다뤘지만, 함수형 컴포넌트에서는 이러한 기능을 훅 함수를 통해 제공한다.</font><br />
<font size=2>또한 사용자가 원하는 커스텀 훅(Custom hook)을 제작할 수도 있다.</font><br /><br />

<font size=2>2. useRef()</font><br />
<font size=2>useRef는 DOM 요소나 컴포넌트 안에서 유지하고 싶은 변수를 관리하는 데 사용된다.</font><br />
<font size=2>useRef로 생성한 변수는 컴포넌트의 모든 렌더링 사이에 값이 유지되며, 필요에 따라 값을 갱신할 수 있다.</font><br />
<font size=2>useRef는 리액트에서 DOM API에 접근할 수 있는 기능을 제공한다.</font><br />
<font size=2>일반적인 자바스크립트 환경이라면 다음과 같이 DOM에 접근해야 한다.</font><br />
```
▪ 자바스크립트 : document.querySelector("input");
▪ 리액트 : const textRef = useRef("");
```
<font size=2>그러나 리액트에서는 useRef를 이용해서 DOM에 접근할 수 있다.</font><br />
<font size=2>예제에서 작성한 input 태그를 보면 ref 속성이 정의된 것을 확인할 수 있다.</font><br />
```
<input
 ref={textRef}
 ...
/>
```
<font size=2>ref에 위에서 작성한 textRef를 추가하면 textRef.current라는 속성으로 input 태그에 접근할 수 있다.</font><br />
<font size=2>주석 5번에서 textRef.current를 console.log()로 출력하고 있습니다.</font><br /><br />

<font size=2>3. useState()</font><br />
<font size=2>useState는 대표적인 상태 관리 함수로서, useState 함수를 호출하면 상태값과 상태를 갱신하는 함수가 반환된다.</font><br />
<font size=2>이를 통해 상태를 변경하면 리액트는 자동으로 해당 컴포넌트를 리렌더링하여 업데이트된 상태를 반영한다.</font><br />
<font size=2>useState를 정의하는 방법은 아래와 같다.</font><br />
```
 const [ text, setText ] = useState("");
```
<font size=2>위에서 정의된 text 변수는 input 태그의 value에 등록하여 setText 함수 내용이 업데이트될 때마다 동일하게 출력합니다.</font><br />
```
 <input
  value={text}
  onChange={onTextStateChangeHandler}
  ...
 />
```
<font size=2>리액트에서는 이벤트를 등록하는 방법은 매우 간단하다.</font><br />
<font size=2>input에 onChange 이벤트를 등록하기 위해 미리 정의된 onTextStateChangeHandler()를 작성했다.</font><br />
<font size=2>주석 6번의 onTextStateChangeHandler() 함수 내부를 보면 이벤트 파라미터인 e를 이용해서 setText() 내용을 업데이트하는 걸 볼 수 있다.</font><br />
```
 const onTextStateChangeHandler = (e) => {
    const msg = e.target.value;
    setText(msg);
 };
```
<br />
<font size=2>4. useEffect()</font><br />
<font size=2>useEffect()는 리액트에서 컴포넌트들이 최초로 렌더링된 이후에 호출되는 함수이다.</font><br />
<font size=2>useEffect는 컴포넌트가 마운트 / 언마운트되었을 때나 특정 상태가 변경되었을 때 원하는 동작을 수행할 수 있게 도와준다.</font><br />
<font size=2>이를 통해 API 호출, 이벤트 등록, 상태 감지 등의 작업을 처리할 수 있다.</font><br />
<font size=2>그래서 내부적으로 렌더링 시점 이후에 동작되는 로직들을 주로 추가한다.</font><br />

```
// 4
useEffect(() => {
    setText("Hi");
    console.log("once");
}, []);

// 5
useEffect(() => { 
    console.log(textRef.current);
}, [text]);
```

<br />
<font size=2>위에는 두 개의 useEffect()가 있다.</font><br />
<font size=2>4번의 useEffect()의 경우 두 번째 인자로 빈 배열이 들어있다.</font><br />
<font size=2>그러나 5번의 useEffect()에는 text의 상태값이 배열 형태로 들어있다.</font><br />
<font size=2>이 차이는 한 번만 실행시킬 것이냐 아니면 상태가 변할 때마다 실행할 것이냐이다.</font><br />
<font size=2>만약 두 번째 인자로 아무 값도 넣지 않는다면 무한 반복할 수 있으니 주의해야 합니다.</font><br />
<font size=2></font><br />
<font size=2></font><br />