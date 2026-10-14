# INTHEMENTAL 향 영상 페이지

## 영상 넣는 법
`videos` 폴더에 향별 영상을 아래 이름으로 넣으면 바로 재생돼요.

| 향 | 파일 이름 | 페이지 주소 |
|---|---|---|
| Bija Forest | videos/bija.mp4 | /bija/ |
| Citrus Noble | videos/citrus.mp4 | /citrus/ |
| Helen Aqua | videos/helen.mp4 | /helen/ |
| Honey Suckle Fresh | videos/honeysuckle.mp4 | /honeysuckle/ |
| Hemish Bloom | videos/hemish.mp4 | /hemish/ |

- 영상이 없으면 "영상을 준비하고 있어요." 화면이 나와요.
- 영상을 교체할 땐 같은 파일 이름으로 덮어쓰면 돼요. 페이지 주소와 QR은 그대로예요.
- MP4(H.264), 세로 1080×1920, 5~8MB 정도로 압축하면 좋아요.

## 다른 곳에 올린 영상 쓰기
`assets/app.js` 맨 위 SCENTS 목록에서 향마다 `src`에 영상 주소를 넣으면 그 영상을 재생해요. `src`가 비어 있으면 `videos` 폴더의 파일을 재생해요.

## 공식 홈페이지 링크
`assets/app.js` 맨 위 `HOMEPAGE`에 주소를 넣으면 영상 화면을 터치했을 때 "공식 홈페이지" 버튼이 나와요.

## 로고
`assets/logo.png`에 흰색 로고(배경 투명)를 넣으면 메인 화면에 표시돼요. 없으면 글자로 대신 보여줘요.

## 색상
`assets/style.css` 맨 위의 세 가지 색을 실제 브랜드 hex 값으로 바꾸면 돼요.

## 향 정보 수정
`assets/app.js` 맨 위 SCENTS 목록에서 이름, 넘버, 시간을 고칠 수 있어요.
