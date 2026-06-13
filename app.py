from flask import Flask, request, render_template, jsonify
import csv
import io

app = Flask(__name__)

def parse_answers_csv(file_storage):
    # Expect CSV with two columns per row: question,answer
    stream = io.StringIO(file_storage.stream.read().decode("utf-8-sig"))
    reader = csv.reader(stream)
    data = {}
    for row in reader:
        if not row:
            continue
        if len(row) >= 2:
            q = row[0].strip()
            a = row[1].strip().upper()
            data[q] = a
    return data

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/grade', methods=['POST'])
def grade():
    # Accept either uploaded files or pasted key
    answers_file = request.files.get('answers')
    key_file = request.files.get('key')
    key_text = request.form.get('key_text', '').strip()

    if not answers_file:
        return jsonify({'error': 'Answers file is required (CSV).'}), 400

    try:
        student_answers = parse_answers_csv(answers_file)
    except Exception as e:
        return jsonify({'error': 'Failed to parse answers file: ' + str(e)}), 400

    try:
        if key_file:
            answer_key = parse_answers_csv(key_file)
        elif key_text:
            # parse pasted key (CSV format or lines like '1,A')
            stream = io.StringIO(key_text)
            reader = csv.reader(stream)
            answer_key = {}
            for row in reader:
                if not row:
                    continue
                if len(row) >= 2:
                    q = row[0].strip()
                    a = row[1].strip().upper()
                    answer_key[q] = a
        else:
            return jsonify({'error': 'Answer key required (file upload or paste).'}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to parse key: ' + str(e)}), 400

    # Grade
    all_questions = sorted(set(list(answer_key.keys()) + list(student_answers.keys())), key=lambda x: int(x) if x.isdigit() else x)
    total = len(all_questions)
    correct = 0
    details = []
    for q in all_questions:
        student = student_answers.get(q, '')
        correct_answer = answer_key.get(q, '')
        is_correct = (student == correct_answer and student != '')
        if is_correct:
            correct += 1
        details.append({'question': q, 'student': student, 'correct_answer': correct_answer, 'is_correct': is_correct})

    score = correct
    result = {
        'score': score,
        'total': total,
        'details': details
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
