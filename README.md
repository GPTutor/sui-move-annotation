# sui-move-annotation README

Annotate `.move` file by sui-move-analyzer.

Execute the script using command
```
FILE_PATH="YOUR_MOVE_FILE" OUTPUT_FILE_PATH="YOUR_OUPUT_PATH" npm run test
```

![Alt text](/assets/images/image.png)

To prepare the training data for Sui-Move language, you may use this script to convert move code to annotated move code.

![Alt text](/assets/images/image2.png)

## How to execute at MacOS?


Install Cargo and Sui Move Analyzer following [this tutorial](https://blog.sui.io/move-analyzer-tutorial/)

```
npm install
```

Then run the following
```
FILE_PATH="YOUR_MOVE_FILE" OUTPUT_FILE_PATH="YOUR_OUPUT_PATH" npm run test
```

## How to install at Ubuntu server?


1. install xvfb-run

```bash
sudo apt-get update
sudo apt-get install -y xvfb
```

2. Install Cargo and Sui Move Analyzer following [this tutorial](https://blog.sui.io/move-analyzer-tutorial/)

3. Install Sui-Cli following [this tutorial](https://docs.sui.io/guides/developer/getting-started/sui-install)

4. Execute the sui code to install sui library

```bash
cd move_env_for_api && sui move test
```

5. Install dependencies

```bash
npm install
```


6. Execute by 

```bash
FILE_PATH="INPUT" OUTPUT_FILE_PATH="OUTPUT" xvfb-run npm run test
```