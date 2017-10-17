VERSION := 1.0.0
REPO := ec2.amazonaws.com

db:
	docker build -t votify-db:$(VERSION) ./db

api:
	docker build -t votify-api:$(VERSION) ./api

web:
	docker build -t votify-web:$(VERSION) ./web

all: db api web

publish: api web
	docker push $(REPO)/votify-api:$(VERSION)
	docker push $(REPO)/votify-web:$(VERSION)

.PHONY: db api web all publish
