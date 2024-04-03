## 01. sockjs (320p)

<font size=2>다양한 실시간 서비스를 socket.io라는 라이브러리로 구현했다.</font><br />
<font size=2>socket.io는 웹 소켓을 이용한 서비스를 만들 때 아주 강력한 기능을 제공한다.</font><br />
<font size=2>그러나 이런 socket.io가 만능툴은 아니다.</font><br />
<font size=2>그 이유는 socket.io가 nodejs 서버에 친화적이기 때문이다.</font><br /><br />

<font size=2>실제로 현장에서 프런트앤드 개발자로 일하다 보면 다양한 백엔드 환경과 만나게 된다.</font><br />
<font size=2>하지만 현재 백엔드는 nodejs로 이루어진 환경보다는 자바나 파이썬으로 이루어져 있는 경우가 대부분이다.</font><br />
<font size=2>무엇보다 자바나 파이썬에서는 socket.io를 사용하는 경우가 거의 없다.</font><br />
<font size=2>그래서 HTML5 웹 소켓을 이용하거나 다양한 환경 구성을 제공하는 sockjs를 사용하게 된다.</font><br /><br />

<font size=2>sockjs는 2011년에 처음 배포된 이후로 10년 넘게 꾸준히 사랑받고 있는 웹 소켓 라이브러리이다.</font><br />
<font size=2>socket.io와 마찬가지로 다양한 브라우저와 호환을 이루며 가볍게 사용할 수 있다.</font><br />
<font size=2>무엇보다 자바, 파이썬, nodejs, Perl과 같은 환경에서도 구현할 수 있다는 장점이 있다.</font><br />
<font size=2>sockjs를 이용해서 전송된 메시지가 접속한 사용자에게 모두 제공되는 간단한 채팅 서비스를 만들겠다.</font><br /><br />

<font size=2>우리가 만들 채팅 서비스는 sockchat이다.</font><br />
<font size=2>먼저 사용자 아이디를 입력하는 창을 띄운다.</font><br />
<font size=2>아이디를 입력하고 들어가면 채팅할 수 있는 input 박스를 보여준다.</font><br />
<font size=2>대화방을 기준으로 왼쪽에는 자신이 입력한 채팅이 출력되고, 오른쪽에는 상대방이 입력한 내용이 출력되도록 구현한다.</font><br />

### 프로젝트 초기 설정 (322p)

<font size=2>socketjs라는 프로젝트 폴더를 생성하고 그 아래에 server와 client 폴더를 만든다.</font><br />
<font size=2>client 폴더 생성은 CRA를 이용한다.</font><br /><br />

<font size=2>다음으로 server 폴더로 이동해서 npm 프로젝트를 설정하고 server.js 파일을 생성한다.</font><br />
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