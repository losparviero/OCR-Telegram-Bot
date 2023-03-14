# OCR Telegram Bot

Recognise text from images using Tesseract in Telegram!

<br>

### Brief Note

This bot utilises Tesseract to perform OCR on images. Tesseract is an open source OCR engine with support for many languages. You need it installed on your system for this to work.

<br>

### Install

1. Clone git repo.
2. Run ```npm i``` in project folder.
3. Install Tesseract. Instructions can be found [here](https://github.com/tesseract-ocr/tesseract#installing-tesseract).
4. Rename example.env to .env and provide bot token.
5. Run ```node bot``` to start the bot.

#### It's advisable to run the bot using PM2 or any startup manager for persistent execution.

<br>

### Uninstall

1. Use ```rm -rf```.

*Note:* If you're unfamiliar with this command, delete project folder from file explorer.

2. Tesseract uninstall instructions will depend on your host system and method of install.

<br>

### Mechanism

The bot uses the tesseractocr lib to interact with Tesseract programmatically.

<br>


    Copyright (C) 2023  Zubin

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

