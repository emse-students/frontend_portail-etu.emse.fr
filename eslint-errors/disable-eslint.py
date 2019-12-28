import os

MODIFY_FILES = True
USE_TEMP_FILE = False

if not USE_TEMP_FILE:
    # Get lint errors and store them in a temp file

    res = os.popen('npx eslint --quiet --cache \'src/**/*.ts\'').read()
    # print(res)
    with open('temp.txt', 'w') as temp:
        temp.write(res)


def echap_error_type(error_type):
    error_type_parts = error_type.split('/')
    if len(error_type_parts) == 1:
        return error_type
    else:
        return '\/'.join(error_type_parts)

# Get the lint errors from the temp file
f = open('temp.txt', "r")
contents = f.readlines()
f.close()

errors_by_file = dict()
errors_by_error = dict()
current_file = 'none'
line_appended = 0
for line in contents:

    # If the line is not empty
    if line is not '\n':

        # Remove the \n
        line = line.rstrip()

        if line[0] == '/':

            # This line is a new file
            current_file = line
            print(line)
            line_appended = 0

        # '✖ 152 errors found' is the last line of the eslint report, it should not be parsed
        elif line[0] != '✖':

            # This line is an error
            error = line.split(" ")
            line_number_not_found = True
            index = 0

            # Get the line number, it's always at the same place
            line_number = ''
            while line_number_not_found:
                if error[index] != '':
                    line_number_not_found = False
                    line_number = error[index]
                else:
                    index += 1
            line_number = line_number.split(':')[0]

            # The error type is always the last part of the error
            error_type = error[-1]

            # The error is stored in the errors_by_file dict
            if current_file in errors_by_file:
                if errors_by_file[current_file][-1]['line_number'] == int(line_number) + line_appended - 1:
                    if MODIFY_FILES:
                        os.system("sed -i '" + str(int(line_number) + line_appended - 1) + "s/$/, " + echap_error_type(error_type) + "/' " + current_file)
                    # print('replace line ' + str(int(line_number) + line_appended - 1))
                else:
                    errors_by_file[current_file].append({'line_number': int(line_number) + line_appended, 'error_type': error_type})
                    if MODIFY_FILES:
                        os.system("sed -i '" + str(int(line_number) + line_appended) + "i // eslint-disable-next-line " + error_type + "' " + current_file)
                    # print('add line ' + str(int(line_number) + line_appended))
                    line_appended += 1
            else:
                errors_by_file[current_file] = [{'line_number': int(line_number), 'error_type': error_type}]
                if MODIFY_FILES:
                    os.system("sed -i '" + line_number + "i // eslint-disable-next-line " + error_type + "' " + current_file)
                # print('add line ' + line_number)
                line_appended += 1

            # The error is stored in the errors_by_error dict
            if error_type in errors_by_error:
                errors_by_error[error_type].append({'file': current_file, 'line_number': errors_by_file[current_file][-1]['line_number']})
            else:
                errors_by_error[error_type] = [{'file': current_file, 'line_number': errors_by_file[current_file][-1]['line_number']}]
            # print(current_file + ' ' + line_number + ' ' + error_type)


# print(errors_by_file)
with open('eslint_errors_by_file.txt', 'w') as errors_by_file_file:
    for file in errors_by_file:
        errors_by_file_file.write('###\n')
        errors_by_file_file.write(file + ' ' + str(len(errors_by_file[file])) + ' errors\n')
        print(file)
        for error in errors_by_file[file]:
            print(error)
            errors_by_file_file.write('line ' + str(error['line_number']) + ': ' + error['error_type'] + '\n')

# print(errors_by_error)
with open('eslint_errors.txt', 'w') as errors_file:
    with open('eslint_errors_by_error.txt', 'w') as errors_by_error_file:
        for error in errors_by_error:
            errors_by_error_file.write('###\n')
            errors_file.write(error + ' ' + str(len(errors_by_error[error])) + ' errors\n')
            errors_by_error_file.write(error + ' ' + str(len(errors_by_error[error])) + ' errors\n')
            print(error)
            for file in errors_by_error[error]:
                print(file)
                errors_by_error_file.write(file['file'] + ':' + str(file['line_number']) + '\n')
total = 0
for error_type in errors_by_error:
    total += len(errors_by_error[error_type])
print(str(total) + " errors")


