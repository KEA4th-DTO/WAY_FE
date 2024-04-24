import React from 'react'
import "../../assets/scss/layout/_historypost.scss";
import user3 from "../../assets/images/users/user3.jpg";
import like from "../../assets/images/logos/like.png";
import comment from "../../assets/images/logos/comment.png";
import more from "../../assets/images/logos/more.png";
import comment_more from "../../assets/images/logos/comment_more.png";
import sky from "../../assets/images/bg/sky.png";
import close from "../../assets/images/logos/close.png";
import img from "../../assets/images/bg/bg5.png";

const HistoryPost = ({ data, onClose  }) => {
  const handleCloseClick = () => {
    onClose(); // 부모 컴포넌트에 닫기 이벤트 전달
  };
  
  return (
      <div style={{border: "3px solid red"}}className="floating-history-comment-floating-history-comment">
        <div style={{border: "3px solid yellow"}} className="floating-history-comment-history-floating-window-expanded-comment">
        <img
            src={close}
            alt="닫기"
            className="floating-history-comment-x11"
            onClick={handleCloseClick} // 닫기 버튼 클릭 시 handleCloseClick 함수 호출
        />

        {/* -------------게시글------------ */}
          <span style={{border: "3px solid green"}} className="floating-history-comment-text065">
            <span>History</span>
          </span>
          <span className="floating-history-comment-text067">
            <span>{data.title}</span>
          </span>
          <div style={{border: "3px solid red"}} id='작성자 정보' className="floating-history-comment-frame28">
          <div className="floating-history-comment-frame29">
            <img
              src={user3}
              alt="작성자 프로필이미지"
              className="floating-history-comment-freeiconuser14907114"
            />
          </div>
          <span className="floating-history-comment-text116">
            <span>{data.memberId}</span>
          </span>
        </div>
          <span className="floating-history-comment-text112">
             <span>{data.createdAt}</span>
         </span>
        <span className="floating-history-comment-text114">
          <span>팔로우</span>
        </span>
        <img
          src={more}
          alt="더보기"
          className="floating-history-comment-freeiconmenu83733991"
        />

            {/* -------------게시글 내용------------ */}    
        <div style={{border: "3px solid red", overflow:"auto"}}>
          <span className="floating-history-comment-text069">
            내용
            </span>
          <img
            src={img}
            alt="IMAGEHistoryImage1351"
            className="floating-history-comment-image-history-image"
          />
          <span className="floating-history-comment-text097">
            <span>게시글 끝</span>
          </span>
          {/* -------------해시태그------------ */}
        <div style={{border: "3px solid red"}} id='해시태그' className="floating-history-comment-frame">
            <span className="floating-history-comment-text">
            <span>#짱구</span>
            </span>
            <span className="floating-history-comment-text002">
            <span>#가천대</span>
            </span>
            <span className="floating-history-comment-text004">
            <span>#위례</span>
            </span>
        </div>
    </div>
        {/* -------------게시글 좋아요수, 댓글수------------ */}
          <div className="floating-history-comment-frame26">
            <img
              src={like}
              alt="게시글 좋아요"
              className="floating-history-comment-svg"
            />
            <span id='좋아요 수' className="floating-history-comment-text107">
              <span>95</span>
            </span>
          </div>

          <div className="floating-history-comment-frame27">
            <div className="floating-history-comment-comment">
              <img
                src={comment}
                alt="댓글"
                className="floating-history-comment-vector"
              />
            </div>
            <span id='댓글수' className="floating-history-comment-text109">
                5
            </span>
          </div>
        </div>
     

        {/* ------------댓글------------- */}
          <div style={{border: "3px solid red"}} id='댓글 컨테이너' className="floating-history-comment-frame01">
            <div style={{border: "3px solid red"}} id='댓글 컨텐츠' className="floating-history-comment-frame02">
                <div style={{border: "3px solid orange"}} id='좋아요' className="floating-history-comment-frame04">
                    <img
                        src={like}
                        alt="좋아요"
                        className="floating-history-comment-hearts1"
                    />
                    <span className="floating-history-comment-text012">
                        <span>댓글 좋아요 수</span>
                    </span>
                </div>
              <img
                src={comment_more}
                alt="댓글 더보기"
                className="floating-history-comment-image"
              />

              <div style={{border: "3px solid orange"}} id='댓글 작성자' className="floating-history-comment-frame03">
              <img
                  src={user3}
                  alt="댓글 작성자 프로필이미지"
                  className="floating-history-comment-freeiconuser1490711"
                />
                <span style={{border: "3px solid orange"}} id='사용자 아이디' className="floating-history-comment-text006">
                  <span>{data.memberId}</span>
                </span>
              </div>
              <span style={{border: "3px solid orange"}}  className="floating-history-comment-text008">
                <span>댓글 내용</span>
              </span>
              <span className="floating-history-comment-text010">
                <span>댓글단 날짜</span>
              </span>
            </div> 
            <div className="floating-history-comment-frame08">
              <div className="floating-history-comment-frame10">
                <span className="floating-history-comment-text026">
                  <span>댓글 달기</span>
                </span>
              </div>
              <div className="floating-history-comment-frame09">
                <span className="floating-history-comment-text024">
                  <span>삭제하기</span>
                </span>
              </div>
            </div>
          </div>

           {/* ------------답글------------- */}
          
          <div style={{border: "3px solid green"}} id='답글 컨테이너' className="floating-history-comment-frame19">
            <div style={{border: "3px solid orange"}} className="floating-history-comment-frame14">
                <img
                    src={like}
                    alt="좋아요"
                    className="floating-history-comment-image3"
                />
                <span className="floating-history-comment-text034">0</span>
                </div>
            <div style={{border: "3px solid green"}} id='답글 컨텐츠' className="floating-history-comment-frame12">
              <span className="floating-history-comment-text028">
                <span>답글 내용입니다!</span>
              </span>
              <span className="floating-history-comment-text030">
                <span>답글 작성 날짜</span>
              </span>
                <div className="floating-history-comment-frame13">
                <img
                  src={user3}
                  alt="댓글 작성자 프로필이미지"
                  className="floating-history-comment-freeiconuser1490711"
                />
                    <span className="floating-history-comment-text032">
                    <span>아이디</span>
                    </span>
                </div>
                <img
                    src={comment_more}
                    alt="더보기"
                    className="floating-history-comment-image2"
                />
            </div>
            <div className="floating-history-comment-frame08">
              <div className="floating-history-comment-frame10">
                <span className="floating-history-comment-text026">
                  <span>댓글 달기</span>
                </span>
              </div>
              <div className="floating-history-comment-frame09">
                <span className="floating-history-comment-text024">
                  <span>신고하기</span>
                </span>
              </div>
            </div>
          </div>

         {/* ------------댓글 작성칸------------- */}
   
          <div style={{border: "3px solid green"}} className="floating-history-comment-group45">
            <img
              src="/external/rectangle391351-s4js.svg"
              alt="Rectangle391351"
              className="floating-history-comment-rectangle39"
            />
            <div style={{border: "3px solid green"}} className="floating-history-comment-group36">
              <div className="floating-history-comment-group27">
                <span className="floating-history-comment-text059">
                  <span>10술집</span>
                </span>
              </div>
              <img
                src={user3}
                alt="작성자 프로필이미지"
                className="floating-history-comment-freeiconuser14907112"
              />
            </div>
            <img
            style={{border: "3px solid green"}}
              src="/external/rectangle401351-jkhk-200h.png"
              alt="Rectangle401351"
              className="floating-history-comment-rectangle40"
            />
            
                <div style={{border: "3px solid green"}} className="floating-history-comment-frame25">
                <span className="floating-history-comment-text061">
                    <span>등록</span>
                </span>
                </div>
                <span className="floating-history-comment-text063">
                <span>댓글을 입력해주세요.</span>
                </span>
          </div>

      </div>
    
  );
};

export default HistoryPost;
