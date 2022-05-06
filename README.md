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

```shell
$ npx dotenv -e .local.env -- ts-node src/scripts/updateParticipantTaskStatus.ts <UserId> <QuestionId>
```

**ユーザーの課題ステータス一覧を見たい場合**

```shell
$ npx dotenv -e .local.env -- ts-node src/scripts/getUsersQuestionList.ts --list <UserId1>,<UserId2>
```

**課題を更新したい場合**

```shell
$ npx dotenv -e .local.env -- ts-node src/scripts/updateQuestion.ts --id <QuestionId> --title <Title> --description <Description>
```
