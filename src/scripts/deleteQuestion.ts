import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { program } from "commander";

const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;

const main = async () => {
  program.parse(process.argv);
  const questionId = program.args[0];
  if (!questionId) {
    throw new Error("質問のidが正しく設定されていません。");
  }

  if (serviceAccount) {
    initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
    });

    const db = getFirestore();
    // サブコレクションを横断的に検索する方法が見つからなかったので、愚直に全てのユーザーをなめる
    const userDocuments = await db.collection("User").listDocuments();

    console.log(`質問:${questionId}を削除します。`);
    try {
      // ユーザー側のwhere句でquestionのrefが必要になるため、先に取得する処理を行う
      const questionRef = await db.collection("Question").doc(questionId);

      userDocuments.forEach(async (doc) => {
        const snapshot = await db
          .collection("User")
          .doc(doc.id)
          .collection("questions")
          .where("question", "==", questionRef)
          .get();
        snapshot.forEach(async (doc) => {
          await doc.ref.delete();
        });
      });

      await questionRef.delete();

      console.log("success!");
    } catch (e) {
      console.log("failure:", e);
    }
  }
};

main();
