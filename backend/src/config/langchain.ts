import { parse } from 'partial-json';

import logger from '@src/utils/logger';
import { OPENAI_API_KEY } from '@src/utils/secret';

export async function createLLMAnswer(
  language: string,
  request: string,
  code: string
): Promise<{
  code: string;
  comments: Array<{ line: number; description: string }>;
}> {
  const { ChatOpenAI } = await import('@langchain/openai');
  const { ChatPromptTemplate } = await import('@langchain/core/prompts');
  const { StringOutputParser } = await import('@langchain/core/output_parsers');

  const chatModel = new ChatOpenAI({
    openAIApiKey: OPENAI_API_KEY,
    modelName: 'gpt-4-1106-preview',
    temperature: 0.1,
  });
  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `당신은 간결하고 선언적인 코드 작성을 보여줌으로써 사용자에게 코딩을 가르치는 전문 프로그래밍 도우미입니다.
사용자는 실제 프로그래밍 중에 발생할 수 있는 다양한 코드 문제에 대해 질문할 것입니다.
질문은 사용자가 문제를 겪은 코드와 그 언어, 그리고 간단한 요청 사항으로 구성됩니다.
요청에 맞게 사용자가 제시한 코드를 수정하거나, 필요한 경우 전체 코드를 처음부터 다시 작성하고 변경한 줄에 대한 설명을 줄 번호와의 쌍으로 하여 전체 코드와 함께 제공해야 합니다.
작성하는 코드는 일반화를 고려하여 비효율적인 반복을 없애고, 언어와 기술의 최신 실무 동향을 반영하며, 실무에 적용할 수 있을 만큼 충분한 품질을 보장해야 합니다.
질문과 답변은 다음 예와 같은 json 형식으로 되어 있습니다. 답변은 다음 json 형식을 준수하여 생성되어야 합니다:
      
입력 예시:
{{
  "language": "python",
  "request": "피보나치 수열을 계산하는 함수를 작성했습니다. 성능을 최적화하는 방법을 제안해주세요.",
  "code": "def fibo(n):\\n    if n == 1 or n == 2:\\n        return 1\\n    return fibo(n-1) + fibo(n-2)"
}}
          
출력 예시:
{{
  "code": "memo = [0] * sys.maxsize\\ndef fibo(n):\\n    if n == 1 or n == 2:\\n        return 1\\n    if memo[n] == 0:\\n        memo[n] = fibo(n-1) + fibo(n-2)\\n    return meno[n]",
  "comments": [
    {{
      "line": 1,
      "description": "메모이제이션을 위해 0으로 초기화된 최대 크기의 memo 리스트를 선언합니다."
    }},
    {{
      "line": 4,
      "description": "저장된 결과가 없으면 하위 문제를 바탕으로 직접 계산합니다. 계산이 끝나면 추후 재활용을 위해 결과를 저장합니다."
    }}
  ]
}}
`,
    ],
    ['user', '{input}'],
  ]);

  const chain = prompt.pipe(chatModel).pipe(new StringOutputParser());
  const input = JSON.stringify({ language, request, code });

  logger.info(
    'An AI response request was received with the following input: ' + input
  );

  const stream = await chain.stream({ input });
  let message = '';

  for await (const chunk of stream) {
    process.stdout.write(chunk);
    message += chunk;
  }
  process.stdout.write('\n');

  logger.info('The AI output the following response: ' + message);

  return parse(
    message.substring(message.indexOf('{'), message.lastIndexOf('}') + 1)
  );
}
