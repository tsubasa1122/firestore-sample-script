# Firestore を使ったサンプルスクリプト

### これは何？

- PrahaChallenge の Firestore 課題回答用のリポジトリです

### Setup

```
$ gh repo clone tsubasa1122/firestore-sample-script
$ cd firestore-sample-script
$ yarn
```

### Scripts

**ユーザーの課題のステータスを更新したい場合**

```
$ npx dotenv -e .local.env -- ts-node src/scripts/updateParticipantTaskStatus.ts <UserId> <QuestionId>
```
