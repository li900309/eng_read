import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Card, CardContent } from '@/components/base';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card variant="elevated" className="text-center">
          <CardContent className="p-8">
            {/* 404 Icon */}
            <motion.div
              className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-primary">404</div>
            </motion.div>

            {/* Title and Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h1 className="text-2xl font-bold text-foreground mb-2">
                页面未找到
              </h1>
              <p className="text-muted-foreground mb-8">
                抱歉，您访问的页面不存在或已被移动。
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1" onClick={() => navigate(-1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  返回上页
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    回到首页
                  </Link>
                </Button>
              </div>

              <Button variant="ghost" asChild>
                <Link to="/vocabulary/search">
                  <Search className="h-4 w-4 mr-2" />
                  搜索词汇
                </Link>
              </Button>
            </motion.div>

            {/* Help Text */}
            <motion.div
              className="mt-8 p-4 bg-muted/30 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="font-medium text-foreground mb-2">需要帮助？</h3>
              <p className="text-sm text-muted-foreground mb-3">
                您可以尝试以下操作：
              </p>
              <ul className="text-sm text-muted-foreground text-left space-y-1">
                <li>• 检查网址拼写是否正确</li>
                <li>• 返回上一页面继续浏览</li>
                <li>• 使用搜索功能查找内容</li>
                <li>• 联系客服获取帮助</li>
              </ul>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;