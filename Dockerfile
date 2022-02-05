FROM ruby:3.0.3

RUN apt-get update -qq && apt-get install -y \
    nodejs \
    npm \
    && npm install -g yarn \
    && echo end
RUN gem install rails -v "6.1.4.1" -N

ENV RAILS_ENV=production

WORKDIR /usr/src/app
# RUN rails _6.1.4.1_ new . \
#     --force \
#     --skip-action-mailer \
#     --skip-action-mailbox \
#     --skip-test \
#     --skip-system-test \
#     --skip-active-record \
#     --webpack=typescript \
#     && echo end
COPY . ./
RUN bundle config set --local without 'test development' \
    && bundle install \
    && bundle exec rails assets:clobber \
    && bundle exec rails assets:precompile \
    && chmod +x /usr/src/app/bin/start \
    && echo end

EXPOSE 3000

CMD ["bin/start"]
