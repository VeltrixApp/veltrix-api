import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';

describe('POST /posts/from-url (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.post.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a DRAFT post for a valid URL', async () => {
    const sourceUrl = 'https://example.com/ai/release';

    const response = await request(app.getHttpServer())
      .post('/posts/from-url')
      .send({ sourceUrl })
      .expect(201);

    expect(response.body.sourceUrl).toBe(sourceUrl);
    expect(response.body.status).toBe('DRAFT');
    expect(response.body.id).toBeDefined();
    expect(response.body.title).toContain('example.com');
  });

  it('is idempotent for duplicate sourceUrl and returns existing post', async () => {
    const sourceUrl = 'https://example.com/security/incident';

    const first = await request(app.getHttpServer())
      .post('/posts/from-url')
      .send({ sourceUrl })
      .expect(201);

    const second = await request(app.getHttpServer())
      .post('/posts/from-url')
      .send({ sourceUrl })
      .expect(200);

    expect(second.body.id).toBe(first.body.id);
    expect(second.body.sourceUrl).toBe(sourceUrl);

    const count = await prisma.post.count({ where: { sourceUrl } });
    expect(count).toBe(1);
  });
});
