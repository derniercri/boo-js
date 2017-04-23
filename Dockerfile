FROM debian:sid

ADD ./lib ./
ADD yarn.lock ./
ADD boo ./
ADD package.json ./

RUN apt-get update && apt-get install curl gpg -y && \
    curl -sL https://deb.nodesource.com/setup_7.x | bash - && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install build-essential yarn nodejs -y && \
    apt-get install python cmake libboost-dev libboost-thread-dev libboost-system-dev libsqlite3-dev subversion curl libcurl4-openssl-dev libusb-dev zlib1g-dev libssl-dev git -y && \
    apt-get install libudev-dev -y && \
    git clone https://github.com/OpenZWave/open-zwave.git && \
    ln -s open-zwave-read-only open-zwave && \
    cd open-zwave && \
    make && \
    make install && \
    cd .. && \
    yarn install --dev && \
    rm -r open-zwave && \
    apt-get remove -y build-essential cmake libboost-dev libboost-thread-dev libboost-system-dev libsqlite3-dev subversion curl libcurl4-openssl-dev libusb-dev zlib1g-dev libssl-dev git curl gpg yarn && \
    rm -rf /var/lib/apt/lists/*

CMD ['boo']
