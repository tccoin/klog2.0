FROM node:latest

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y locales \
    && sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen \
    && dpkg-reconfigure --frontend=noninteractive locales \
    && update-locale LANG=en_US.UTF-8

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    htop \
    yarn

WORKDIR /app

# build with local files
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn install
COPY ./ /app

# build with git
# RUN git clone https://github.com/tccoin/klog2.0.git /app
# WORKDIR /app
# RUN yarn install

# build the bundled app
RUN yarn run build

EXPOSE 3000
ENTRYPOINT [ "bash" ]