FROM ruby:3.0.3

RUN apt-get update -qq && apt-get install -y \
    nodejs \
    npm \
    && npm install -g yarn \
    && echo end
RUN gem install rails -v "6.1.4.1" -N

WORKDIR /usr/src/app
RUN rails _6.1.4.1_ new . \
    --force \
    --skip-action-mailer \
    --skip-action-mailbox \
    --skip-test \
    --skip-system-test \
    --skip-active-record \
    --webpack=typescript \
    && echo end
COPY . ./
RUN bundle install \
    && bundle exec rails assets:clobber \
    && RAILS_ENV=production bundle exec rails assets:precompile

RUN chmod +x /usr/src/app/bin/start

# RUN bundle exec rake assets:precompile RAILS_ENV=production

EXPOSE 3000

CMD ["bin/start"]
