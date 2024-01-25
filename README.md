# madweek4
![자산 7hor_logo_blue.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/7f592094-fa2d-482d-be3d-9ca71504eb99/%EC%9E%90%EC%82%B0_7hor_logo_blue.png)

# CoAI

> 개발자들이 질문을 하고 지식을 공유할 수 있는 AI 플랫폼
> 

---

### 개발환경

- 프론트 : React
- 백엔드 : Node.js
- DB : PostgreSQL

### Team

- 박현우: KAIST 전산학부 19학번
- 송지효: KAIST 전산학부 20학번

---

## **Project Description**

### Main Page

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/9f9297c5-0c7f-471f-9900-2a2fbe1bb7b3/Untitled.png)

- 좌측 사이드바
    
    > 질문 게시판, 알림, 마이페이지 등으로 이동할 수 있는 네비게이션 바
    > 
- 헤더
    
    > 현재 알림 개수를 볼 수 있는 버튼과 로그인, 회원가입, 로그아웃 등을 할 수 있는 버튼
    > 

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/7417d3f1-7f15-4b26-a7c8-fc34de4695ca/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/4f52e601-e37a-448b-99ce-5cf8dd6dc0fc/Untitled.png)

- 화면
    
    > 중앙의 Hero image 아래로 최신의 질문목록과 유저들의 랭킹을 볼 수 있음
    > 
    

## **Login Page**

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/b018bca0-c983-44e0-b159-83148321bcdf/Untitled.png)

> 쿠키로 로그인 정보를 저장해 로그인 상태를 유지시킴
> 

## Signup Page

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/26d570ca-4378-44a3-9884-4b9374ce4f4b/Untitled.png)

> ID, 비밀번호, 별명, 자기소개 등을 입력하여 회원가입
> 

> 우측과 같이 몇가지 보기 중 프로필 사진을 선택할 수 있음
> 

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/13380439-1032-498a-8863-5579bf35e210/Untitled.png)

## Notification Page

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/8bfa8dfe-7ab8-4e6e-9fc7-a65a59d8c0ed/Untitled.png)

> 자신이 올린 질문에 답변이 달렸을 때, 자신의 답변에 좋아요가 눌렸을 때 알림을 한눈에 보고 해당 질문으로 이동하거나 알림을 삭제할 수 있음
> 

## Questions Page

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/7680e7ab-7e03-41bb-a753-91c0985c68ae/Untitled.png)

> 모든 질문을 한 눈에 볼 수 있는 페이지
> 

> 우측의 아이콘을 눌러 제목, 태그, 작성자 등 원하는 카테고리로 검색할 수 있음
> 
> 
> ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/55b04259-0227-4a98-8be9-1bde71ef88af/Untitled.png)
> 

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/c86f84ad-aa2e-4ec4-8e38-e7113973aa9e/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/e03886bb-8f7d-4cac-9d79-38b29b4a21e0/Untitled.png)

## Detail Page

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/0c6e9ab7-3afa-4e64-b84b-75020102c1db/Untitled.png)

> 특정 질문으로 들어가면 질문의 내용과 코드를 볼 수 있음
> 

> 질문 카드 아래로는 다른 이용자들이 작성한 답변 카드들이 보임
> 
- 질문카드
    
    > 작성자일 경우 우측 상단에 수정 및 삭제 버튼이 보임
    > 
    
    > 하단의 언어 태그를 누르면 해당 태그를 검색한 상태의 questions page로 이동함
    > 
- 답변 카드
    
    > 좋아요 싫어요 버튼과 답변이 언제 작성됐는지 등을 확인할 수 있음
    > 
    > 
    > ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/4c85597d-5979-460d-bfc2-8b901de862cf/Untitled.png)
    > 
    
    > 코드 오른쪽의 화살표를 클릭하면 작성자가 해당 줄의 코드에 대하여 작성한 코멘트를 확인할 수 있음
    > 
    
    > 자신이 작성한 답변카드의 경우 좋아요 싫어요 버튼이 보이지 않으며, 대신 우측하단에 수정 및 삭제 버튼이 보임
    > 
    > 
    > ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/305be4e4-5f0e-4470-b8b0-4d52d22e99c4/Untitled.png)
    > 

- 새 답변 카드
    
    > 코드를 작성하고 오른쪽에 마우스를 갖다대면 + 버튼이 보이며 클릭하여 해당 줄에 관한 코멘트를 작성할 수 있음
    > 
    > 
    > ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/065f0663-4953-4036-8e66-32ccd5a760c2/Untitled.png)
    > 

## Ask Page (New Question)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/ca3bd1e0-58f7-4eea-9d9a-44336c6a01a3/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/dfcb9ef8-ae81-4369-b48f-341f7cd22fde/Untitled.png)

> 새로운 질문을 올리는 창
> 

> 크게 질문을 간단한 줄글로 올리는 Title과 코드를 작성하는 Code Area로 이루어짐
> 

> Select Language에 따라 언어 태그가 자동생성되며 Code Area의 Code 역시 자동 하이라이트됨
> 

> 하단의 체크박스로 AI-generated 답변을 받을 것인지 말 것인지 선택할 수 있음
> 

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/82cf4d1d-a2a5-4322-bfc3-0d5196587d46/Untitled.png)

## User Page

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/af2d5037-7731-49bf-aa7e-c39a9a30870b/Untitled.png)

> 좌측의 프로필 정보와 함께 우측에는 가장 많이 질문하고 답변한 세가지 언어를 확인할 수 있음
> 

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/64fd5fb5-424c-49fb-976d-66791b4e5325/Untitled.png)

> 그 아래로는 자신이 작성한 질문, 자신이 답변한 질문만 모아볼 수 있으며 클릭할 경우 해당 질문으로 바로 이동할 수 있음
> 

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/e36b1489-5da2-43f2-b15a-16bec5690ac0/Untitled.png)

> Edit Profile 버튼을 눌러 아이디 이외의 사용자 정보를 수정할 수 있음
> 

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/8487cc7c-22ce-421b-9642-c3b352efa7cf/Untitled.png)

> Question Page 등에서 사용자 닉네임을 눌러 타인의 프로필 역시 확인할 수 있으며 이 경우엔 프로필 수정 버튼이 보이지 않음
>
