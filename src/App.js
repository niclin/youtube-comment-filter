import React, { useState } from "react";
import "./index.css";
import {googleApiKey} from "./setting"

const App = () => {
  const [url, setUrl] = useState("https://youtu.be/BGaDN9wxbKE");
  const [startText, setStartText] = useState("");
  const [endText, setEndText] = useState("");
  const [comments, setComments] = useState([]);
  const [replyedCommentId, setReplyedCommentId] = useState([])

  const fetchYoutubeComment = () => {
    const videoId = url.split("/").slice(-1)[0];

    fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=100&order=time&videoId=${videoId}&key=${googleApiKey}`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        const comments = myJson.items.map((item) => {
          return { commentId: item.id, content: item.snippet.topLevelComment.snippet.textOriginal };
        });

        const reverseComments = comments.reverse();
        setComments(reverseComments);
      });
  };

  const handelSubmit = (event) => {
    fetchYoutubeComment();
    event.preventDefault();
  };

  const fliterComments = () => {
    return comments.filter((comment) => {
      if (replyedCommentId.includes(comment.commentId)) {
        return
      }

      const lowerCaseComment = comment.content.toLowerCase();
      if (
        lowerCaseComment.includes(startText) &&
        lowerCaseComment.includes(endText)
      ) {
        return comment;
      }
    });
  };

  const tagIsReplyed = (commentId) => {
    setReplyedCommentId([...replyedCommentId, commentId])
  }

  return (
    <div className="App" className="container mx-auto">
      <div className="grid grid-cols-1">
        <div>
          <form
            className="bg-white shadow-md rounded px-8 py-8 pt-8"
            onSubmit={(event) => handelSubmit(event)}
          >
            <label className="text-sm block font-bold pb-2">
              Youtube URL:
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                type="text"
                name="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
              />
            </label>

            <label className="text-sm block font-bold pb-2">
              開頭文字
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                type="text"
                name="StartText"
                value={startText}
                onChange={(event) => setStartText(event.target.value)}
              />
            </label>

            <label className="text-sm block font-bold pb-2">
              結尾文字
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                type="text"
                name="endText"
                value={endText}
                onChange={(event) => setEndText(event.target.value)}
              />
            </label>
            <input
              type="submit"
              value="送出"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            />
          </form>
        </div>

        <div>
          <div className="bg-white shadow-md px-8 py-8 pt-8">
            <ol className="list-disc">
              {fliterComments().map((comment) => {
                return (
                  <div className="shadow-inner rounded px-8 py-8 pt-8 mb-8 border border-indigo-60">

                    <p className="comment-text">{comment.content}</p>
                    <button className="mt-8 bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => tagIsReplyed(comment.commentId)}>
                      已回覆
                    </button>

                  </div>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
