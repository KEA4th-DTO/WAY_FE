import way_logo from "../assets/images/logos/way_logo.png";

export const shareKakao = () => {
  // url이 id값에 따라 변경되기 때문에 route를 인자값으로 받아줌
  if (window.Kakao) {
    const kakao = window.Kakao;
    const Kakao_IP = process.env.REACT_APP_KAKAO_SECRET;
    if (!kakao.isInitialized()) {
      kakao.init(`${Kakao_IP}`);
    }

    kakao.Link.sendDefault({
      objectType: "feed", // 카카오 링크 공유 여러 type들 중 feed라는 타입 -> 자세한 건 카카오에서 확인
      content: {
        title: "Where Are You ?", // 인자값으로 받은 title
        description: "지도 기반 커뮤니티 웹서비스", // 인자값으로 받은 title
        imageUrl: { way_logo },
        link: {
          mobileWebUrl: "http://localhost:3000/#/localmap", // 인자값으로 받은 route(uri 형태)
          webUrl: "http://localhost:3000/#/localmap",
        },
      },
      buttons: [
        {
          title: "WAY로 가기",
          link: {
            mobileWebUrl: "http://localhost:3000/#/localmap",
            webUrl: "http://localhost:3000/#/localmap",
          },
        },
      ],
    });
  }
};
