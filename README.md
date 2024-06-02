## chatappの環境構築
好きなディレクトリに移動する。
```
mkdir workdir
cd workdir
```

そこで以下のコマンドを入力する。
```
git clone https://github.com/Sanodeveloper/chatapp.git
```

migratorでmysqlにテーブルを構築する。
```
docker compose up -d --build mysql migrator
```

以下の実行して"MySQL is up - executing command"となれば成功。これでマイグレーションは終了。
```
docker compose logs -f migrator
```

次に、compose.yamlファイルをコメントアウトに編集する。
```
74| /bin/bash -c "/migrator/migrate.sh $$DB_HOST $$DB_PORT $$DB_NAME $$DB_USERNAME /run/secrets/user_password up"

74| #/bin/bash -c "/migrator/migrate.sh $$DB_HOST $$DB_PORT $$DB_NAME $$DB_USERNAME /run/secrets/user_password up"
```

次に、以下のコマンドを実行する
```
docker compose up -d --build
```
これで環境構築は終了である。

 - [こちらから確認できる](http://localhost:3000/home)

## トラブルシューティング
通常10~20秒待つと画面が表示される。
もしエラー画面になるようだったら以下のコマンドで確認してみてほしい
```
docker compose logs -f api
docker compose logs -f socket
```

入力してどちらかにエラーが出ていたら以下のコマンドで再起動
```
docker compose down
docker compose up -d
```

これを2~3回繰り返すといけるはず






