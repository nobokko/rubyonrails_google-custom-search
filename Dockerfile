FROM ruby:3.0.3

RUN apt-get update -qq && apt-get install -y \
    nodejs \
    npm \
    && npm install -g yarn \
    && gem install rails -v "6.1.4.1" -N \
    && echo end

ENV RAILS_ENV=production

WORKDIR /usr/src/app
COPY . ./
RUN bundle config set --local without 'test development' \
    && bundle install \
    && bundle exec rails assets:clobber \
    && bundle exec rails assets:precompile \
    && chmod +x /usr/src/app/bin/start \
    && echo end

EXPOSE 3000

CMD ["bin/start"]
