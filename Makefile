VERSION := 1.0.0

USERNAME := strainj
ECR_URI := 590312749310.dkr.ecr.ap-southeast-2.amazonaws.com

api:
	docker build -t $(ECR_URI)/$(USERNAME)-api:$(VERSION) ./api

web:
	docker build -t $(ECR_URI)/$(USERNAME)-web:$(VERSION) ./web

all: api web

repo:
	aws ecr create-repository --repository-name $(USERNAME)-web
	aws ecr create-repository --repository-name $(USERNAME)-api

publish: api web
	docker push $(ECR_URI)/$(USERNAME)-web:$(VERSION)
	docker push $(ECR_URI)/$(USERNAME)-api:$(VERSION)

.PHONY: api web all publish
