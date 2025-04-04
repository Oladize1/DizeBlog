import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { usePostStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../Component/Spinner';
import DOMPurify from 'dompurify';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');

  const navigate = useNavigate();
  const { createPost, isLoading, error } = usePostStore();

  if (isLoading) return <Spinner />;
  if (error) return toast(error);

  const canSave = Boolean(title) && Boolean(description) && Boolean(content);

  const handleCreatePost = async (e) => {
    e.preventDefault();

    const parser = new DOMParser();
    const plainContent = parser.parseFromString(content, 'text/html').body.textContent || '';

    if (plainContent.length < 50) {
      toast.error('Content must be at least 50 characters long.');
      return;
    }
    try {
      const newPost = await createPost(title, description, plainContent);
      setTitle('');
      setDescription('');
      setContent('');
      toast.success('Post created successfully');
      navigate('/');
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data);
      if (error?.message?.name === 'TokenExpiredError') {
        logout();
        navigate('/login');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-center text-4xl mb-6">Create Post</h2>
      <form
        className="flex flex-col gap-4 justify-center items-center w-full max-w-3xl mx-auto"
        onSubmit={handleCreatePost}
      >
        <div className="w-full">
          <input
            type="text"
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-lg w-full"
          />
        </div>
        <div className="w-full">
          <input
            type="text"
            placeholder="Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input input-lg w-full"
          />
        </div>
        <div className="w-full">
          <Editor
            apiKey="u7l5afp21ko7qz3c4j0gsoimxzwu3hnehxzxzzpc7p503lzm"
            value={content}
            onEditorChange={(newContent, editor) => setContent(newContent)}
            init={{
              width: '100%',
              // plugins: [
              //   'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image',
              //   'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks',
              //   'wordcount', 'formatpainter', 'a11ychecker', 'tinymcespellchecker',
              //   'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage',
              //   'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents',
              //   'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss',
              //   'markdown','importword', 'exportword', 'exportpdf'
              // ],
              toolbar:
                'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
              tinycomments_mode: 'embedded',
              setup: (editor) => {
                editor.on('blur', () => {
                  const plainText = editor.getContent({ format: 'text' });
                  if (plainText.length < 50) {
                    toast.error('Content must be at least 50 characters long.');
                  }
                });
              },
              tinycomments_author: 'Author name',
              mergetags_list: [
                { value: 'First.Name', title: 'First Name' },
                { value: 'Email', title: 'Email' },
              ],
              ai_request: (request, respondWith) =>
                respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
            }}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-4 w-full" disabled={!canSave}>
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;
