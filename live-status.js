const TWITCH_CLIENT_ID = "32xfu23g976cvy3tlfif12molnr7od";
const TWITCH_CLIENT_SECRET = "hdva03n2tnu74nyjcbe55we52lk51y";
const YOUTUBE_API_KEY = "AIzaSyDVINaXhfUsmtB9jWTWYW-C3Oa7kDOx4w0";
const YOUTUBE_CHANNEL_ID = "UCSnAuq8Ay_hL9UL56jq9_hg";

async function isTwitchLive() {
  try {
    const authResponse = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      body: new URLSearchParams({
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
    });

    const authData = await authResponse.json();
    const token = authData.access_token;

    const userResponse = await fetch(
      "https://api.twitch.tv/helix/users?login=charlysasmr",
      {
        headers: {
          Authorization: Bearer ${token},
          "Client-Id": TWITCH_CLIENT_ID,
        },
      }
    );

    const userData = await userResponse.json();
    const userId = userData.data[0].id;

    const streamResponse = await fetch(
      https://api.twitch.tv/helix/streams?user_id=${userId},
      {
        headers: {
          Authorization: Bearer ${token},
          "Client-Id": TWITCH_CLIENT_ID,
        },
      }
    );

    const streamData = await streamResponse.json();
    return streamData.data.length > 0;
  } catch (error) {
    console.error("Error al verificar Twitch:", error);
    return false;
  }
}

async function isYouTubeLive() {
  try {
    const url = https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&eventType=live&type=video&key=${YOUTUBE_API_KEY};
    const response = await fetch(url);
    const data = await response.json();
    return data.items && data.items.length > 0;
  } catch (error) {
    console.error("Error al verificar YouTube:", error);
    return false;
  }
}

async function isKickLive() {
  return false;
}

async function updateLiveStatus() {
  const twitchLive = await isTwitchLive();
  const youtubeLive = await isYouTubeLive();
  const kickLive = await isKickLive();

  const twitchContainer = document.getElementById("twitch-preview");
  if (twitchContainer) {
    twitchContainer.outerHTML = twitchLive
      ? <iframe src="https://player.twitch.tv/?channel=charlysasmr&parent=localhost" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
      : <video id="twitch-preview" autoplay loop muted><source src="no-live.mp4" type="video/mp4"></video>;
  }

  const youtubeContainer = document.getElementById("youtube-preview");
  if (youtubeContainer) {
    youtubeContainer.outerHTML = youtubeLive
      ? <iframe width="100%" height="100%" src="https://www.youtube.com/embed/live_stream?channel=${YOUTUBE_CHANNEL_ID}&autoplay=1" frameborder="0" allowfullscreen></iframe>
      : <video id="youtube-preview" autoplay loop muted><source src="no-live.mp4" type="video/mp4"></video>;
  }

  const kickContainer = document.getElementById("kick-preview");
  if (kickContainer) {
    kickContainer.outerHTML = kickLive
      ? <iframe src="https://player.kick.com/charlysasmr" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
      : <video id="kick-preview" autoplay loop muted><source src="no-live.mp4" type="video/mp4"></video>;
  }
}

updateLiveStatus();
setInterval(updateLiveStatus, 60000);