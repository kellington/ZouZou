# ZouZou ReadMe



### Server file
curl -fsSL https://ZouZou-and-friends.replit.app/api/daily/leaderboard | jq .
{
  "date": "2026-08-31",
  "entries": [
    {
      "name": "Rob",
      "seconds": 257
    }
  ]
}


### Cookie file
example:
{
  "easy": 42,
  "medium": 118,
  "hard": null,
  "daily": 67,
  "lastDailyDate": "2026-08-30",
  "playerName": "Alex",
  "dailyStreak": 4,
  "lastPlayedDate": "2026-08-30"
}