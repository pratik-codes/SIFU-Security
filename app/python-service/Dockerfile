FROM public.ecr.aws/lambda/python:3.11

RUN yum update -y && yum install -y python3-dev \
                        gcc \
                        libc-dev \  
                        openldap-dev \
                        net-snmp-dev \
                        openssl-dev \
                        cairo-dev  \
                        g++  \
			            zlib-dev \
			            bzip2-dev \
			            libpng-dev \
			            harfbuzz-dev \
            			make
RUN yum install -y pkgconfig cairo-devel


COPY lambda_function.py ${LAMBDA_TASK_ROOT}

COPY . ${LAMBDA_TASK_ROOT}

RUN pip install -r /var/task/requirements.txt

CMD ["lambda_function.lambda_handler"]