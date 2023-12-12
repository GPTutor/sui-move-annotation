# sui-move-annotation README

Annotate `.move` file by sui-move-analyzer.

Execute the script using the command
```
FILE_PATH="YOUR_MOVE_FILE" OUTPUT_FILE_PATH="YOUR_OUPUT_PATH" npm run test
```

![Alt text](/assets/images/image.png)

To prepare the training data for Sui-Move language, you may use this script to convert move code to annotated move code.

Execute the script of this repo to convert Sui-move code to annotated sui-move code for future training.

<img width="1038" alt="image" src="https://github.com/GPTutor/sui-move-annotation/assets/43432631/1fc0b8a6-b0cc-4e3d-9da5-66b8cc9f08fe">


## Set up for server
You may use it as API by running the following command:

```
npm run server
```

Then go to `https://localhost:3000/api/docs` to see the API document

Example Demo API https://move-annotate-backend.gptutor.tools/api/docs

<img width="1491" alt="image" src="https://github.com/GPTutor/sui-move-annotation/assets/43432631/404422fd-e5ae-4494-999b-e1875cded203">


## How to execute at MacOS?


### 1. Install Cargo and Sui Move Analyzer following [this tutorial](https://blog.sui.io/move-analyzer-tutorial/)


### 2. Install dependencies 
```
npm install
```

### 3. Initialize Sui Move

Execute the following command to download the necessary dependencies. These dependencies will be accessible to the Sui-Move-Analyzer. In case you need the Sui-Move analyzer to recognize modules from other sources, like [Bucket Protocol's Entry functions](https://github.com/Bucket-Protocol/v1-periphery), you should modify the Move.toml at `./move_env_for_api`. Specifically, you can add the desired module under this file's [dependencies] section.
```bash
cd move_env_for_api && sui move test
```


### 4. Execute

```
FILE_PATH="YOUR_MOVE_FILE" OUTPUT_FILE_PATH="YOUR_OUPUT_PATH" npm run test
```



## How to install at the Ubuntu server?


### 1. install xvfb-run

```bash
sudo apt-get update
sudo apt-get install -y xvfb
```

### 2. Install Cargo and Sui Move Analyzer following [this tutorial](https://blog.sui.io/move-analyzer-tutorial/)

### 3. Install Sui-Cli following [this tutorial](https://docs.sui.io/guides/developer/getting-started/sui-install)

### 4. Execute the sui code to install sui library

```bash
cd move_env_for_api && sui move test
```

### 5. Install dependencies

```bash
npm install
```


6. Initialize Sui Move

Execute the following command to download the necessary dependencies. These dependencies will be accessible to the Sui-Move-Analyzer. In case you need the Sui-Move analyzer to recognize modules from other sources, like [Bucket Protocol's Entry functions](https://github.com/Bucket-Protocol/v1-periphery), you should modify the Move.toml at `./move_env_for_api`. Specifically, you can add the desired module under this file's [dependencies] section.

```bash
cd move_env_for_api && sui move test
```

6. Execute the convertsion 

```bash
FILE_PATH="INPUT" OUTPUT_FILE_PATH="OUTPUT" xvfb-run npm run test
```

# Limitation and Future Works:

The current API only supports single-threading, as it cannot execute multiple VS Code Tests simultaneously. Future versions will change to have a VS Code instance constantly running in the backend. A database like Redis will be used to store and manage tasks temporarily. As long as there are tasks, this Extension will automatically execute them to maximize the speed of concurrent execution.
