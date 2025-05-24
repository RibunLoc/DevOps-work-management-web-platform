import React from 'react'

const SubProposalComment = () => {
  return (
    <div>
      {/* currentComment.replies.map((reply, index) => (
              <div className={style.container} key={index}>
                <Avatar src={reply?.userInfo.avatar} />
                <div className={style.containerRight}>
                  <div className={style.card}>
                    <div className={style.cardHeader}>
                      <h4>
                        {reply?.userInfo.firstname +
                          " " +
                          reply?.userInfo.lastname}
                      </h4>
                    </div>
                    <div className={style.cardBody}>
                      <p>{reply?.content}</p>
                    </div>
                  </div>
                  <div className={style.cardFooter}>
                    <div className={style.cardFooterActions}>
                      <p style={{ fontSize: "13px", marginTop: "1px" }}>
                        {reply?.createdAt &&
                          getTimeAgo(reply?.createdAt)}
                      </p>
                      <button
                        className={clsx({
                          [style.like]: reply?.isLiked != null,
                        })}
                        onClick={handleLikeComment}
                      >
                        Like
                      </button>
                      <button
                        className={style.replyBtn + " " + style.btn}
                        onClick={() => setShowReplyBar(!showReplyBar)}
                      >
                        Reply
                      </button>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifySelf: "right",
                      }}
                    >
                      {reply?.likedUserInfo ? (
                        reply?.likedUserInfo.length > 0 ? (
                          <>
                            <p style={{ fontSize: "13px" }}>
                              {reply?.likedUserInfo.length}{" "}
                            </p>
                            <ThumbUp
                              sx={{ marginLeft: "5px" }}
                              color="primary"
                            />
                          </>
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )) */}
    </div>
  )
}

export default SubProposalComment
