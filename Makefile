.PHONY: nop
nop:

.PHONY: build-archives
build-archives:
	$(RM) -r ${CURDIR}/out
	mkdir -p ${CURDIR}/out
	for d in ${CURDIR}/templates/*; do (cd $$d && npm pack --pack-destination ${CURDIR}/out); done
	ls ${CURDIR}/out >> index.txt && mv index.txt ${CURDIR}/out
