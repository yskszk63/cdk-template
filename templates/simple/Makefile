CDK = npm run cdk

.PHONY: nop
nop:

.PHONY: synth
synth:
	$(CDK) synth

.PHONY: build
build:
	$(CDK) --app cdk.out build

.PHONY: deploy
deploy:
	$(CDK) --app cdk.out deploy
