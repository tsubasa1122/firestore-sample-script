import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { program } from "commander";

type Question = {
  id: string;
  title: string;
  description: string;
  status: string;
};

type User = {
  id: string;
  name: string;
  questions: Question[];
};

type response = User[];

const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;

const main = async () => {
  program
    .option("-l, --list <items>", "comma separated list", (value) => {
      return value.split(",");
    })
    .parse(process.argv);

  const userIds = program.opts().list as string[];

  if (serviceAccount) {
    initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
    });
    const db = getFirestore();

    const data: response = await Promise.all(
      userIds.map(async (userId) => {
        const userRef = db.collection("User").doc(userId);
        const questionRef = await userRef.collection("questions");

        const userSnapshot = await userRef.get();
        const snapshot = await questionRef.get();
        // docsを使用しているがデータ量が多い場合はforEachにする https://qiita.com/xx2xyyy/items/4ac3e03f198021e4206a
        const questions = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const subCollectionQuestion = await doc.data();
            const questionRes = await subCollectionQuestion.question.get();

            return {
              id: questionRes.id,
              title: questionRes.data().title,
              description: questionRes.data().description,
              status: subCollectionQuestion.status,
            };
          })
        );

        const userData = {
          id: userSnapshot.id,
          name: userSnapshot.data()?.name,
          questions: questions,
        };

        return userData;
      })
    );

    console.log(JSON.stringify(data));
  }
};

main();
