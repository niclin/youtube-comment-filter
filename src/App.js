import React, { useState } from "react";

const App = () => {
  const [url, setUrl] = useState("https://youtu.be/BGaDN9wxbKE");
  const [startText, setStartText] = useState("");
  const [endText, setEndText] = useState("");
  const [comments, setComments] = useState([]);

  const fetchYoutubeComment = () => {
    const videoId = url.split("/").slice(-1)[0];

    fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=100&order=time&videoId=${videoId}&key=AIzaSyBHcXH__Q7bf-MoM26cYZ0FK3XZQWL81pk`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        setComments(
          myJson.items.map((item) => {
            return item.snippet.topLevelComment.snippet.textOriginal;
          })
        );
      });
  };

  const handelSubmit = (event) => {
    fetchYoutubeComment();
    event.preventDefault();
  };

  const fliterComments = () => {
    return comments.filter((comment) => {
      const lowerCaseComment = comment.toLowerCase();
      if (
        lowerCaseComment.includes(startText) &&
        lowerCaseComment.includes(endText)
      ) {
        return comment;
      }
    });
  };

  return (
    <div className="App">
      <form onSubmit={(event) => handelSubmit(event)}>
        <label>
          Youtube URL:
          <input
            type="text"
            name="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </label>

        <label>
          開頭文字
          <input
            type="text"
            name="StartText"
            value={startText}
            onChange={(event) => setStartText(event.target.value)}
          />
        </label>

        <label>
          結尾文字
          <input
            type="text"
            name="endText"
            value={endText}
            onChange={(event) => setEndText(event.target.value)}
          />
        </label>
        <input type="submit" value="Submit" />
        <ol>
          {fliterComments().map((comment, index) => {
            return <li key={index}>{comment}</li>;
          })}
        </ol>
      </form>
    </div>
  );
};

export default App;
