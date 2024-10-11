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

RUN yum install -y curl build-essential

# Install Rust using the official installation script
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y

# Set the path for Rust binaries
ENV PATH="/root/.cargo/bin:${PATH}"


COPY lambda_function.py ${LAMBDA_TASK_ROOT}

COPY . ${LAMBDA_TASK_ROOT}

RUN python -m pip install --upgrade pip

RUN pip install -r /var/task/requirements.txt

CMD ["lambda_function.lambda_handler"]
