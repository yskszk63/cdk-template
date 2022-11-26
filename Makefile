.PHONY: nop
nop:

.PHONY: build-archives
build-archives:
	$(RM) -r ${CURDIR}/out
	mkdir -p ${CURDIR}/out
	for d in ${CURDIR}/templates/*; do\
		(\
			cd "$$d" &&\
			name=$$(npm pack --json --dry-run|jq '.[0]|.filename' -r) &&\
			npm pack --pack-destination "${CURDIR}/out" &&\
			mv "${CURDIR}/out/$$name" "${CURDIR}/out/$$(basename $$d).tgz"\
		)\
	done
	ls ${CURDIR}/out >> index.txt && mv index.txt ${CURDIR}/out
